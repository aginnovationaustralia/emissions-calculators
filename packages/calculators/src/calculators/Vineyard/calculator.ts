import { VineyardInput } from '@/types/Vineyard/input';
import { VineyardOutput } from '@/types/Vineyard/output';
import { VineyardVegetation } from '@/types/Vineyard/vineyard-vegetation.input';
import { VineyardCrop } from '@/types/Vineyard/vineyard.input';
import { State } from '@/types/enums';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateScope3Fertiliser } from '../Grains/Scope3Fertiliser';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import { calculateScope1Urea } from '../common/fertiliser/Scope1Urea';
import {
  calculateCommercialFlights,
  calculateFreight,
} from '../common/freight';
import { calculateScope1And3Fuel } from '../common/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { calculateScope1WasteWater } from '../common/waste/Scope1WasteWater';
import { calculateSolidWaste } from '../common/waste/SolidWaste';
import { ExecutionContext } from '../executionContext';
import { calculateScope1N2O } from './Scope1';
import { ConstantsForVineyardCalculator } from './constants';

function getIntensities(
  netTotal: number,
  carbonSequestration: number,
  cropProducedKg: number,
) {
  return {
    vineyardsExcludingSequestration: divideBySafeFromZero(
      netTotal + carbonSequestration,
      cropProducedKg,
    ),
    vineyardsIncludingSequestration: divideBySafeFromZero(
      netTotal,
      cropProducedKg,
    ),
    cropProducedKg,
  };
}

function calculateSingleVineyard(
  state: State,
  vineyard: VineyardCrop,
  carbonSequestration: number,
  context: ExecutionContext<ConstantsForVineyardCalculator>,
  id: string,
) {
  const fuelTotals = calculateScope1And3Fuel(vineyard.fuel, state, context);

  const scope1N2O = calculateScope1N2O(vineyard, context);

  const electricity = calculateElectricityScope2And3(
    state,
    vineyard.electricitySource,
    vineyard.electricityRenewable,
    vineyard.electricityUse,
    context,
  );

  const scope1Urea = calculateScope1Urea(
    vineyard,
    vineyard.areaPlanted,
    context,
  );

  const scope1Limestone = calculateScope1Lime(
    vineyard.limestone,
    vineyard.limestoneFraction,
    context,
  );

  const scope3Lime = calculateScope3Lime(vineyard.limestone, context);
  const scope3Herbicide = calculateScope3Herbicide(
    vineyard.glyphosateOtherHerbicideUse,
    vineyard.herbicideUse,
    context,
  );

  const wasteWaterCO2 = calculateScope1WasteWater(vineyard.fluidWaste, context);

  const { compostedSolidWasteCO2, solidWasteSentOffsite } = calculateSolidWaste(
    vineyard.solidWaste,
    context,
  );

  const inboundFreightCO2 = calculateFreight(vineyard.inboundFreight, context);
  const outboundFreightCO2 = calculateFreight(
    vineyard.outboundFreight,
    context,
  );
  const commercialFlightsCO2 = calculateCommercialFlights(
    vineyard.totalCommercialFlightsKm,
    context,
  );

  const scope3Fertiliser = calculateScope3Fertiliser(
    {
      ...vineyard,
      // This key mapping may seem unnecessary, vineyard is very similar to grains.
      // But the input terminology needs to be a little different
      areaSown: vineyard.areaPlanted,
    },
    context,
  );

  const totalN2O =
    scope1N2O.fertiliserN2O +
    scope1N2O.cropResiduesN2O +
    scope1N2O.leechingN2O +
    scope1N2O.atmosphericN2O +
    fuelTotals.n2o;

  const res = {
    scope1: addTotalValue({
      fuelCO2: fuelTotals.co2,
      limeCO2: scope1Limestone,
      ureaCO2: scope1Urea,
      wasteWaterCO2,
      compostedSolidWasteCO2,
      fuelCH4: fuelTotals.ch4,
      fertiliserN2O: scope1N2O.fertiliserN2O,
      atmosphericDepositionN2O: scope1N2O.atmosphericN2O,
      cropResidueN2O: scope1N2O.cropResiduesN2O,
      leachingAndRunoffN2O: scope1N2O.leechingN2O,
      fuelN2O: fuelTotals.n2o,
      totalCH4: fuelTotals.ch4,
      totalCO2:
        fuelTotals.co2 +
        scope1Limestone +
        scope1Urea +
        wasteWaterCO2 +
        compostedSolidWasteCO2,
      totalN2O,
    }),
    scope2: addTotalValue({
      electricity: electricity.scope2,
    }),
    scope3: addTotalValue({
      fertiliser: scope3Fertiliser.total,
      herbicide: scope3Herbicide.total,
      electricity: electricity.scope3,
      fuel: fuelTotals.scope3Total,
      lime: scope3Lime,
      commercialFlights: commercialFlightsCO2,
      inboundFreight: inboundFreightCO2,
      solidWasteSentOffsite,
      outboundFreight: outboundFreightCO2,
    }),
  };

  const result = {
    output: res,
    extensions: {
      carbonSequestration,
      amountProduced: vineyard.averageYield * vineyard.areaPlanted,
    },
    net: {
      total:
        res.scope1.total +
        res.scope2.electricity +
        res.scope3.total -
        carbonSequestration,
    },
    meta: {
      id,
    },
  };

  return result;
}

export function calculateEntireVineyard(
  vineyards: VineyardCrop[],
  vegetation: VineyardVegetation[],
  context: ExecutionContext<ConstantsForVineyardCalculator>,
): VineyardOutput {
  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    vegetation,
    'allocationToVineyards',
    vineyards,
    context,
  );

  const vineyardResults = vineyards.map((vineyard, index) =>
    calculateSingleVineyard(
      vineyard.state,
      vineyard,
      carbonSequestration.intermediate[index],
      context,
      vineyard.id ?? index.toString(),
    ),
  );

  const total = sumIntermediateResults(
    {
      output: {
        scope1: {
          fuelCO2: 0,
          limeCO2: 0,
          ureaCO2: 0,
          fertiliserN2O: 0,
          atmosphericDepositionN2O: 0,
          cropResidueN2O: 0,
          leachingAndRunoffN2O: 0,
          fuelN2O: 0,
          fuelCH4: 0,
          wasteWaterCO2: 0,
          compostedSolidWasteCO2: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          total: 0,
        },
        scope2: { electricity: 0, total: 0 },
        scope3: {
          fertiliser: 0,
          electricity: 0,
          fuel: 0,
          herbicide: 0,
          lime: 0,
          inboundFreight: 0,
          outboundFreight: 0,
          commercialFlights: 0,
          solidWasteSentOffsite: 0,
          total: 0,
        },
      },
      net: {
        total: 0,
      },
      extensions: {
        carbonSequestration: 0,
        amountProduced: 0,
      },
      meta: {
        id: '',
      },
    },
    vineyardResults,
  );

  const intensities = vineyardResults.map((result) =>
    getIntensities(
      result.net.total,
      result.extensions.carbonSequestration,
      result.extensions.amountProduced,
    ),
  );

  const result: VineyardOutput = {
    carbonSequestration,
    intermediate: vineyardResults.map((vineyard) => ({
      carbonSequestration: { total: vineyard.extensions.carbonSequestration },
      id: vineyard.meta.id,
      scope1: vineyard.output.scope1,
      scope2: vineyard.output.scope2,
      scope3: vineyard.output.scope3,
      intensities: getIntensities(
        vineyard.net.total,
        vineyard.extensions.carbonSequestration,
        vineyard.extensions.amountProduced,
      ),
      net: vineyard.net,
    })),
    scope1: total.output.scope1,
    scope2: total.output.scope2,
    scope3: total.output.scope3,
    intensities,
    net: {
      vineyards: vineyardResults.map((n) => n.net.total),
      total: vineyardResults.reduce((acc, n) => acc + n.net.total, 0),
    },
  };

  return result;
}

export function calculateVineyard(
  input: VineyardInput,
  context: ExecutionContext<ConstantsForVineyardCalculator>,
) {
  return calculateEntireVineyard(input.vineyards, input.vegetation, context);
}
