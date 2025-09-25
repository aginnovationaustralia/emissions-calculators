import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import {
  calculateScope1TransportCH4,
  calculateScope1TransportCO2,
  calculateScope1TransportN2O,
} from '../common-legacy/transport';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../common/fertiliser';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { calculateScope3PurchasedFeed } from '../common/livestock';
import { addTotalValue } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { DairyComplete } from '../types/Dairy/dairy.input';
import { DairyInput } from '../types/Dairy/input';
import { DairyOutput } from '../types/Dairy/output';
import { DairyProductionSystem, State } from '../types/types';
import { ConstantsForDairyCalculator } from './constants';
import { getEmissionsIntensities } from './functions';
import { calculateScope1 } from './Scope1';
import { calculateScope1Urea } from './Scope1Urea';

export function calculateSingleDairy(
  state: State,
  dairy: DairyComplete,
  system: DairyProductionSystem,
  rainfallAbove600: boolean,
  context: ExecutionContext<ConstantsForDairyCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const mergedDairyFertiliser = mergeOtherFertilisers(dairy.fertiliser);

  const {
    totalAnimalWaste: animalWasteN2O,
    atmosphericDepositionN2O,
    totalEntericMethane: entericCH4,
    leachingN2O: leachingAndRunoffN2O,
    totalManureN2O: manureManagementN2O,
    totalMethaneTonnes: manureManagementCH4,
    urineDungTonnes: urineAndDungN2O,
    totalN2OFromFertiliser: fertiliserN2O,
  } = calculateScope1(dairy, system, state, rainfallAbove600, context);

  // Lime
  const limeCO2 = calculateScope1Lime(
    dairy.limestone,
    dairy.limestoneFraction,
    context,
  );

  // Fuel

  const fuelCO2 = calculateFuelScope1CO2LPG(
    dairy.diesel,
    dairy.petrol,
    dairy.lpg,
    context,
    true,
  );

  const fuelCH4 = calculateFuelScope1CH4LPG(
    dairy.diesel,
    dairy.petrol,
    dairy.lpg,
    context,
    true,
  );

  const fuelN2O = calculateFuelScope1N2OLPG(
    dairy.diesel,
    dairy.petrol,
    dairy.lpg,
    context,
    true,
  );

  const transportCO2 = calculateScope1TransportCO2(
    dairy.truckType,
    dairy.distanceCattleTransported,
    context,
  );
  const transportN2O = calculateScope1TransportN2O(
    dairy.truckType,
    dairy.distanceCattleTransported,
    context,
  );
  const transportCH4 = calculateScope1TransportCH4(
    dairy.truckType,
    dairy.distanceCattleTransported,
    context,
  );

  // Urea

  const ureaCO2 = calculateScope1Urea(mergedDairyFertiliser, context);

  // Electricity

  const dairyElectricity = calculateElectricityScope2And3(
    state,
    'State Grid',
    dairy.electricityRenewable,
    dairy.electricityUse,
    context,
  );

  // Fertiliser

  const dairyFertiliser = calculateScope3Fertiliser(
    mergedDairyFertiliser,
    context,
  );

  // Purchased Mineral Supplementation

  const dairyFeed = calculateScope3PurchasedFeed(
    dairy.grainFeed,
    dairy.hayFeed,
    dairy.cottonseedFeed,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    dairy.herbicide,
    dairy.herbicideOther,
    context,
  );

  const fuelScope3Dairy = calculateScope3FuelWithLPGAverage(
    dairy.diesel,
    dairy.petrol,
    dairy.lpg,
    context,
  );

  const limeScope3Dairy = calculateScope3Lime(dairy.limestone, context);

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2 + transportCO2;
  const totalCH4 = fuelCH4 + entericCH4 + manureManagementCH4 + transportCH4;
  const totalN2O =
    fuelN2O +
    fertiliserN2O +
    urineAndDungN2O +
    animalWasteN2O +
    manureManagementN2O +
    leachingAndRunoffN2O +
    atmosphericDepositionN2O +
    transportN2O;

  // totals

  const scope1 = addTotalValue({
    leachingAndRunoffN2O,
    atmosphericDepositionN2O,
    urineAndDungN2O,
    manureManagementCH4,
    entericCH4,
    fertiliserN2O,
    transportCO2,
    transportCH4,
    transportN2O,
    animalWasteN2O,
    manureManagementN2O,
    limeCO2,
    fuelCO2,
    fuelCH4,
    fuelN2O,
    ureaCO2,
    totalCO2,
    totalCH4,
    totalN2O,
  });

  const scope2 = addTotalValue({
    electricity: dairyElectricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser: dairyFertiliser,
    purchasedFeed: dairyFeed.total,
    herbicide: herbicide.total,
    electricity: dairyElectricity.scope3,
    fuel: fuelScope3Dairy,
    lime: limeScope3Dairy,
  });

  const net = {
    total:
      (scope1.total + scope2.total + scope3.total) *
        (1 - dairy.emissionsAllocationToRedMeatProduction) -
      carbonSequestration,
  };

  const { milkingCows } = dairy.classes;

  const milkProduction = {
    spring: milkingCows.spring.milkProduction ?? 0,
    autumn: milkingCows.autumn.milkProduction ?? 0,
    winter: milkingCows.winter.milkProduction ?? 0,
    summer: milkingCows.summer.milkProduction ?? 0,
  };

  const head = {
    spring: milkingCows.spring.head,
    autumn: milkingCows.autumn.head,
    winter: milkingCows.winter.head,
    summer: milkingCows.summer.head,
  };

  // milk solids
  const milkSolidsSpring =
    ((milkProduction.spring * (365.25 / 4)) / 1.03) * 0.073;
  const milkSolidsAutumn =
    ((milkProduction.autumn * (365.25 / 4)) / 1.03) * 0.073;
  const milkSolidsWinter =
    ((milkProduction.winter * (365.25 / 4)) / 1.03) * 0.073;
  const milkSolidsSummer =
    ((milkProduction.summer * (365.25 / 4)) / 1.03) * 0.073;

  const milkSolidsTotal =
    (milkSolidsSpring * head.spring +
      milkSolidsSummer * head.summer +
      milkSolidsAutumn * head.autumn +
      milkSolidsWinter * head.winter) /
    1000;

  const output = {
    scope1,
    scope2,
    scope3,
    net,
  };

  return {
    output,
    extensions: {
      milkSolidsTotal,
      carbonSequestration,
      emissionsAllocationToRedMeatProduction:
        dairy.emissionsAllocationToRedMeatProduction,
    },
    meta: {
      id,
    },
  };
}

export function calculateDairy(
  input: DairyInput,
  context: ExecutionContext<ConstantsForDairyCalculator>,
): DairyOutput {
  // eslint-disable-next-line no-param-reassign
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.dairy,
    'dairyProportion',
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    input.vegetation,
    'dairyProportion',
    input.dairy,
    context,
  );

  const dairyResults = input.dairy.map((singleDairy, ix) =>
    calculateSingleDairy(
      input.state,
      singleDairy,
      input.productionSystem,
      input.rainfallAbove600,
      context,
      carbonSequestration.intermediate[ix],
      singleDairy.id || ix.toString(),
    ),
  );

  const dairyResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          atmosphericDepositionN2O: 0,
          entericCH4: 0,
          fertiliserN2O: 0,
          leachingAndRunoffN2O: 0,
          manureManagementCH4: 0,
          manureManagementN2O: 0,
          animalWasteN2O: 0,
          urineAndDungN2O: 0,
          transportN2O: 0,
          transportCH4: 0,
          transportCO2: 0,
          totalCH4: 0,
          totalN2O: 0,
          totalCO2: 0,
          fuelCO2: 0,
          fuelCH4: 0,
          fuelN2O: 0,
          ureaCO2: 0,
          limeCO2: 0,
          total: 0,
        },
        scope2: {
          electricity: 0,
          total: 0,
        },
        scope3: {
          fertiliser: 0,
          purchasedFeed: 0,
          herbicide: 0,
          electricity: 0,
          fuel: 0,
          lime: 0,
          total: 0,
        },
        net: {
          total: 0,
        },
      },
      extensions: {
        carbonSequestration: 0,
        emissionsAllocationToRedMeatProduction: 0,
        milkSolidsTotal: 0,
      },
      meta: {
        id: '',
      },
    },
    dairyResults,
  );

  const totalScope123 =
    dairyResult.output.scope1.total +
    dairyResult.output.scope2.total +
    dairyResult.output.scope3.total;

  const redMeatProductionAllocation = dairyResults.reduce(
    (acc, dairy) =>
      acc +
      (dairy.extensions.emissionsAllocationToRedMeatProduction *
        (dairy.output.scope1.total +
          dairy.output.scope2.total +
          dairy.output.scope3.total)) /
        totalScope123,
    0,
  );

  const baseDairyEmissions = {
    scope1: addTotalValue({
      ...dairyResult.output.scope1,
    }),
    scope2: dairyResult.output.scope2,
    scope3: dairyResult.output.scope3,
    net: {
      total:
        (dairyResult.output.scope1.total +
          dairyResult.output.scope2.total +
          dairyResult.output.scope3.total) *
          (1 - redMeatProductionAllocation) -
        carbonSequestration.total,
    },
    carbonSequestration: {
      total: carbonSequestration.total,
    },
  };

  const combinedResult = {
    scope1: baseDairyEmissions.scope1,
    scope2: baseDairyEmissions.scope2,
    scope3: baseDairyEmissions.scope3,
    net: {
      ...baseDairyEmissions.net,
    },
  };

  return {
    ...combinedResult,
    carbonSequestration: {
      total: carbonSequestration.total,
      intermediate: [], // TODO
    },
    intensities: getEmissionsIntensities(
      combinedResult.net.total,
      dairyResult.extensions.milkSolidsTotal,
    ),
    intermediate: dairyResults.map((x) => {
      return {
        ...x.output,
        carbonSequestration: {
          total: x.extensions.carbonSequestration,
        },
        id: x.meta.id,
        intensities: getEmissionsIntensities(
          x.output.net.total,
          x.extensions.milkSolidsTotal,
        ),
      };
    }),
  };
}
