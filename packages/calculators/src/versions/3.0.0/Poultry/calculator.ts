import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import { calculateFuelScope1AllLPG } from '../common-legacy/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import {
  addAcrossAllKeys,
  singleAllocationToArray,
} from '../common/tools/object';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { BroilersComplete } from '../types/Poultry/broilers.input';
import { BroilerSale } from '../types/Poultry/broilersale.input';
import { PoultryInput } from '../types/Poultry/input';
import { LayersComplete } from '../types/Poultry/layers.input';
import { PoultryOutput } from '../types/Poultry/output';
import { State } from '../types/types';
import { calculateScope1BroilersAtmospheric } from './Scope1BroilersAtmospheric';
import { calculateScope1BroilersLeaching } from './Scope1BroilersLeaching';
import { calculateScope1BroilersManure } from './Scope1BroilersManure';
import { calculateScope1LayersAtmospheric } from './Scope1LayersAtmospheric';
import { calculateScope1LayersLeachingN2O } from './Scope1LayersLeaching';
import { calculateScope1LayersManure } from './Scope1LayersManure';
import {
  calculateScope3BroilersPurchasedFeed,
  calculateScope3PurchasedFeed,
} from './Scope3BroilersPurchasedFeed';
import { calculateScope3PurchasedHay } from './Scope3PurchasedHay';
import { calculateScope3PurchasedLivestock } from './Scope3PurchasedLivestock';
import { ConstantsForPoultryCalculator } from './constants';
import { getScope3FuelFunction } from './functions';

function getBroilerIntensities(
  broilerNetTotal: number,
  broilerSequestration: number,
  meatProducedKg: number,
) {
  return {
    poultryMeatExcludingSequestration: divideBySafeFromZero(
      (broilerNetTotal + broilerSequestration) * 1000,
      meatProducedKg,
    ),
    poultryMeatIncludingSequestration: divideBySafeFromZero(
      broilerNetTotal * 1000,
      meatProducedKg,
    ),
    meatProducedKg,
  };
}

function getLayerIntensities(
  layerNetTotal: number,
  layerSequestration: number,
  eggsProducedKg: number,
) {
  return {
    poultryEggsExcludingSequestration: divideBySafeFromZero(
      (layerNetTotal + layerSequestration) * 1000,
      eggsProducedKg,
    ),
    poultryEggsIncludingSequestration: divideBySafeFromZero(
      layerNetTotal * 1000,
      eggsProducedKg,
    ),
    eggsProducedKg,
  };
}

function getIntensities(
  layerNetTotal: number,
  layerSequestration: number,
  totalEggSaleWeight: number,
  broilerNetTotal: number,
  broilerSequestration: number,
  totalSaleWeight: number,
) {
  return {
    ...getLayerIntensities(
      layerNetTotal,
      layerSequestration,
      totalEggSaleWeight,
    ),
    ...getBroilerIntensities(
      broilerNetTotal,
      broilerSequestration,
      totalSaleWeight,
    ),
  };
}

function calculateTotalPurchaseSaleWeightBroilers(sales: BroilerSale[]) {
  return sales.reduce(
    (acc, sale) =>
      acc +
      sale.meatChickenGrowersSales.head *
        sale.meatChickenGrowersSales.saleWeight +
      sale.meatChickenLayers.head * sale.meatChickenLayers.saleWeight +
      sale.meatOther.head * sale.meatOther.saleWeight,
    0,
  );
}

export function calculateSingleBroiler(
  broilers: BroilersComplete,
  state: State,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const electricity = calculateElectricityScope2And3(
    state,
    'State Grid',
    broilers.electricityRenewable,
    broilers.electricityUse,
    context,
  );
  const { litterRecycled, litterRecycleFrequency } = broilers;

  const atmosphericDepositionN2O = calculateScope1BroilersAtmospheric(
    broilers.groups,
    context,
    litterRecycled,
    litterRecycleFrequency,
  );

  const leachingN2O = calculateScope1BroilersLeaching(
    broilers,
    state,
    rainfallAbove600,
    context,
  );

  const manure = calculateScope1BroilersManure(
    broilers.groups,
    state,
    context,
    litterRecycled,
    litterRecycleFrequency,
  );

  const purchasedFeed = calculateScope3BroilersPurchasedFeed(
    broilers.groups,
    context,
  );

  const scope1Fuel = calculateFuelScope1AllLPG(
    broilers.diesel,
    broilers.petrol,
    broilers.lpg,
    context,
    true,
  );

  const scope3Fuel = getScope3FuelFunction(
    context,
    broilers.diesel,
    broilers.petrol,
    broilers.lpg,
  );

  const scope3PurchasedHay = calculateScope3PurchasedHay(broilers.hay, context);

  const scope3PurchasedLivestock = calculateScope3PurchasedLivestock(
    [
      broilers.meatChickenGrowersPurchases,
      broilers.meatChickenLayersPurchases,
      broilers.meatOtherPurchases,
    ],
    broilers.purchasedFreeRange,
    context,
  );

  const scope3Herbicide = calculateScope3Herbicide(
    broilers.herbicide,
    broilers.herbicideOther,
    context,
  );

  const output = {
    scope1: addTotalValue({
      atmosphericDepositionN2O,
      leachingAndRunoffN2O: leachingN2O,
      manureManagementCH4: manure.CH4,
      manureManagementN2O: manure.N2O,
      fuelCH4: scope1Fuel.CH4,
      fuelN2O: scope1Fuel.N2O,
      fuelCO2: scope1Fuel.CO2,
      totalCO2: scope1Fuel.CO2,
      totalN2O:
        atmosphericDepositionN2O + leachingN2O + manure.N2O + scope1Fuel.N2O,
      totalCH4: manure.CH4 + scope1Fuel.CH4,
    }),
    scope2: addTotalValue({ electricity: electricity.scope2 }),
    scope3: addTotalValue({
      purchasedFeed,
      purchasedHay: scope3PurchasedHay,
      purchasedLivestock: scope3PurchasedLivestock,
      herbicide: scope3Herbicide.total,
      electricity: electricity.scope3,
      fuel: scope3Fuel,
    }),
  };

  const totalSaleWeight = calculateTotalPurchaseSaleWeightBroilers(
    broilers.sales,
  );

  const net = {
    total:
      output.scope1.total +
      output.scope2.total +
      output.scope3.total -
      carbonSequestration,
  };

  return {
    output,
    net,
    extensions: { totalSaleWeight, carbonSequestration },
    meta: { id },
  };
}

export function calculateSingleLayer(
  layers: LayersComplete,
  state: State,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const electricity = calculateElectricityScope2And3(
    state,
    'State Grid',
    layers.electricityRenewable,
    layers.electricityUse,
    context,
  );

  const atmosphericDepositionN2O = calculateScope1LayersAtmospheric(
    layers,
    context,
  );
  const leachingN2O = calculateScope1LayersLeachingN2O(state, layers, context);
  const manure = calculateScope1LayersManure(state, layers, context);
  const purchasedFeed = calculateScope3PurchasedFeed(
    layers.feed,
    layers.customFeedPurchased,
    layers.customFeedEmissionIntensity,
    context,
  );

  const scope1Fuel = calculateFuelScope1AllLPG(
    layers.diesel,
    layers.petrol,
    layers.lpg,
    context,
    true,
  );
  const scope3Fuel = getScope3FuelFunction(
    context,
    layers.diesel,
    layers.petrol,
    layers.lpg,
  );

  const scope3PurchasedHay = calculateScope3PurchasedHay(layers.hay, context);

  const scope3PurchasedLivestock = calculateScope3PurchasedLivestock(
    [layers.meatChickenLayersPurchases, layers.layersPurchases],
    layers.purchasedFreeRange,
    context,
  );

  const scope3Herbicide = calculateScope3Herbicide(
    layers.herbicide,
    layers.herbicideOther,
    context,
  );

  const output = {
    scope1: addTotalValue({
      atmosphericDepositionN2O,
      leachingAndRunoffN2O: leachingN2O,
      manureManagementCH4: manure.CH4,
      manureManagementN2O: manure.N2O,
      fuelCH4: scope1Fuel.CH4,
      fuelN2O: scope1Fuel.N2O,
      fuelCO2: scope1Fuel.CO2,
      totalCO2: scope1Fuel.CO2,
      totalN2O:
        atmosphericDepositionN2O + leachingN2O + manure.N2O + scope1Fuel.N2O,
      totalCH4: manure.CH4 + scope1Fuel.CH4,
    }),
    scope2: addTotalValue({ electricity: electricity.scope2 }),
    scope3: addTotalValue({
      purchasedFeed,
      purchasedHay: scope3PurchasedHay,
      purchasedLivestock: scope3PurchasedLivestock,
      herbicide: scope3Herbicide.total,
      electricity: electricity.scope3,
      fuel: scope3Fuel,
    }),
  };

  const averageLayerFlock =
    (layers.layers.autumn +
      layers.layers.spring +
      layers.layers.summer +
      layers.layers.winter) /
    4;

  const averagemeatChickenLayerFlock =
    (layers.meatChickenLayers.autumn +
      layers.meatChickenLayers.spring +
      layers.meatChickenLayers.summer +
      layers.meatChickenLayers.winter) /
    4;

  const totalEggSaleWeight =
    (layers.layersEggSale.eggsProduced *
      averageLayerFlock *
      layers.layersEggSale.averageWeight +
      layers.meatChickenLayersEggSale.eggsProduced *
        averagemeatChickenLayerFlock *
        layers.meatChickenLayersEggSale.averageWeight) /
    1000;

  const net = {
    total:
      output.scope1.total +
      output.scope2.total +
      output.scope3.total -
      carbonSequestration,
  };

  return {
    output,
    net,
    extensions: { totalEggSaleWeight, carbonSequestration },
    meta: { id },
  };
}

export function calculatePoultry(
  input: PoultryInput,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
): PoultryOutput {
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.broilers,
    'broilersProportion',
  );

  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.layers,
    'layersProportion',
  );

  const broilersCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'broilersProportion',
      input.broilers,
      context,
    );

  const layersCarbonSequestration =
    calculateAllCarbonSequestrationWithKeyProportion(
      input.vegetation,
      'layersProportion',
      input.layers,
      context,
    );

  const broilerResults = input.broilers.map((b, i) =>
    calculateSingleBroiler(
      b,
      input.state,
      input.rainfallAbove600,
      context,
      broilersCarbonSequestration.intermediate[i],
      b.id ?? `broiler-${i}`,
    ),
  );
  const layerResults = input.layers.map((l, i) =>
    calculateSingleLayer(
      l,
      input.state,
      context,
      layersCarbonSequestration.intermediate[i],
      l.id ?? `layer-${i}`,
    ),
  );

  const emptyOutput = {
    scope1: {
      atmosphericDepositionN2O: 0,
      leachingAndRunoffN2O: 0,
      manureManagementCH4: 0,
      manureManagementN2O: 0,
      fuelCH4: 0,
      fuelN2O: 0,
      fuelCO2: 0,
      totalCO2: 0,
      totalN2O: 0,
      totalCH4: 0,
      total: 0,
    },
    scope2: { electricity: 0, total: 0 },
    scope3: {
      fertiliser: 0,
      purchasedFeed: 0,
      purchasedHay: 0,
      purchasedLivestock: 0,
      herbicide: 0,
      electricity: 0,
      fuel: 0,
      total: 0,
    },
  };

  const broilerOutput = sumIntermediateResults(
    {
      output: emptyOutput,
      net: { total: 0 },
      extensions: { totalSaleWeight: 0, carbonSequestration: 0 },
      meta: { id: '' },
    },
    broilerResults,
  );
  const layerOutput = sumIntermediateResults(
    {
      output: emptyOutput,
      net: { total: 0 },
      extensions: { totalEggSaleWeight: 0, carbonSequestration: 0 },
      meta: { id: '' },
    },
    layerResults,
  );

  const baseBroilerEmissions = {
    scope1: broilerOutput.output.scope1,
    scope2: broilerOutput.output.scope2,
    scope3: broilerOutput.output.scope3,
    net: {
      total:
        broilerOutput.output.scope1.total +
        broilerOutput.output.scope2.total +
        broilerOutput.output.scope3.total -
        broilersCarbonSequestration.total,
    },
    carbonSequestration: {
      total: broilersCarbonSequestration.total,
    },
  };

  const baseLayerEmissions = {
    scope1: layerOutput.output.scope1,
    scope2: layerOutput.output.scope2,
    scope3: layerOutput.output.scope3,
    net: {
      total:
        layerOutput.output.scope1.total +
        layerOutput.output.scope2.total +
        layerOutput.output.scope3.total -
        layersCarbonSequestration.total,
    },
    carbonSequestration: {
      total: layersCarbonSequestration.total,
    },
  };

  const combinedResult = {
    scope1: addAcrossAllKeys(
      baseBroilerEmissions.scope1,
      baseLayerEmissions.scope1,
    ),
    scope2: addAcrossAllKeys(
      baseBroilerEmissions.scope2,
      baseLayerEmissions.scope2,
    ),
    scope3: addAcrossAllKeys(
      baseBroilerEmissions.scope3,
      baseLayerEmissions.scope3,
    ),
    net: {
      ...addAcrossAllKeys(baseBroilerEmissions.net, baseLayerEmissions.net),
      broilers: baseBroilerEmissions.net.total,
      layers: baseLayerEmissions.net.total,
    },
  };

  return {
    ...combinedResult,
    carbonSequestration: {
      total:
        broilersCarbonSequestration.total + layersCarbonSequestration.total,
      intermediate: [], // TODO
    },
    intermediateBroilers: broilerResults.map((x, i) => ({
      ...x.output,
      carbonSequestration: {
        total: broilersCarbonSequestration.intermediate[i],
      },
      net: x.net,
      intensities: getBroilerIntensities(
        x.net.total,
        broilersCarbonSequestration.intermediate[i],
        x.extensions.totalSaleWeight,
      ),
      id: x.meta.id,
    })),
    intermediateLayers: layerResults.map((x, i) => ({
      ...x.output,
      carbonSequestration: {
        total: layersCarbonSequestration.intermediate[i],
      },
      net: x.net,
      intensities: getLayerIntensities(
        x.net.total,
        layersCarbonSequestration.intermediate[i],
        x.extensions.totalEggSaleWeight,
      ),
      id: x.meta.id,
    })),
    intensities: getIntensities(
      baseLayerEmissions.net.total,
      layersCarbonSequestration.total,
      layerOutput.extensions.totalEggSaleWeight,
      baseBroilerEmissions.net.total,
      broilersCarbonSequestration.total,
      broilerOutput.extensions.totalSaleWeight,
    ),
  };
}
