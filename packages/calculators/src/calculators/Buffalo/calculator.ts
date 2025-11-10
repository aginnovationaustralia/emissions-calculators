import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '@/calculators/common/fertiliser';
import { BuffaloComplete } from '@/types/Buffalo/buffalo.input';
import { BuffaloInput } from '@/types/Buffalo/input';
import { BuffaloOutput } from '@/types/Buffalo/output';
import { BuffaloClassesAPI, State } from '@/types/enums';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../../calculators/common/trees';
import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { calculateScope3PurchasedFeed } from '../common/livestock';
import { addTotalValue } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { ExecutionContext } from '../executionContext';
import { ConstantsForBuffaloCalculator } from './constants';
import { getEmissionsIntensities } from './functions';
import { calculateScope1 } from './Scope1Buffalo';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3PurchaseLivestock } from './Scope3PurchasedLivestock';

/**
 * Entire calculator for buffalo
 * @param state
 * @param rainfallAbove600
 * @param buffalo
 * @returns
 */
export function calculateSingleBuffalo(
  state: State,
  rainfallAbove600: boolean,
  buffalo: BuffaloComplete,
  context: ExecutionContext<ConstantsForBuffaloCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const mergedFertiliser = mergeOtherFertilisers(buffalo.fertiliser);

  const buffaloEmissions = calculateScope1(
    buffalo,
    mergedFertiliser,
    rainfallAbove600,
    state,
    context,
  );

  const limeCO2 = calculateScope1Lime(
    buffalo.limestone,
    buffalo.limestoneFraction,
    context,
  );

  const fuelCO2 = calculateFuelScope1CO2LPG(
    buffalo.diesel,
    buffalo.petrol,
    buffalo.lpg,
    context,
    true,
  );
  const fuelCH4 = calculateFuelScope1CH4LPG(
    buffalo.diesel,
    buffalo.petrol,
    buffalo.lpg,
    context,
    true,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    buffalo.diesel,
    buffalo.petrol,
    buffalo.lpg,
    context,
    true,
  );

  const ureaCO2 = calculateScope1Urea(mergedFertiliser, context);

  const electricity = calculateElectricityScope2And3(
    state,
    buffalo.electricitySource,
    buffalo.electricityRenewable,
    buffalo.electricityUse,
    context,
  );

  const fertiliser = calculateScope3Fertiliser(mergedFertiliser, context);

  const feed = calculateScope3PurchasedFeed(
    buffalo.grainFeed,
    buffalo.hayFeed,
    0,
    context,
  );

  const fuelScope3 = calculateScope3FuelWithLPGAverage(
    buffalo.diesel,
    buffalo.petrol,
    buffalo.lpg,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    buffalo.herbicide,
    buffalo.herbicideOther,
    context,
  );

  const lime = calculateScope3Lime(buffalo.limestone, context);

  const purchasedLivestock = calculateScope3PurchaseLivestock(
    buffalo.classes,
    context,
  );

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2;
  const totalCH4 =
    fuelCH4 +
    buffaloEmissions.manureMethane +
    buffaloEmissions.totalMethaneEnteric;
  const totalN2O =
    buffaloEmissions.totalFertiliserSoil +
    buffaloEmissions.atmosphericN2O +
    buffaloEmissions.totalUrineDung +
    buffaloEmissions.totalLeachingN2O +
    fuelN2O;

  const scope1 = addTotalValue({
    fertiliserN2O: buffaloEmissions.totalFertiliserSoil,
    atmosphericDepositionN2O: buffaloEmissions.atmosphericN2O,
    manureManagementCH4: buffaloEmissions.manureMethane,
    entericCH4: buffaloEmissions.totalMethaneEnteric,
    urineAndDungN2O: buffaloEmissions.totalUrineDung,
    leachingAndRunoffN2O: buffaloEmissions.totalLeachingN2O,
    fuelCO2,
    fuelCH4,
    fuelN2O,
    totalCO2,
    totalCH4,
    totalN2O,
    ureaCO2,
    limeCO2,
  });

  const scope2 = addTotalValue({
    electricity: electricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser,
    electricity: electricity.scope3,
    purchasedFeed: feed.total,
    fuel: fuelScope3,
    herbicide: herbicide.total,
    lime,
    purchasedLivestock,
  });

  const net = {
    total: scope1.total + scope2.total + scope3.total - carbonSequestration,
  };

  const output = {
    scope1,
    scope2,
    scope3,
    net,
  };

  const totalSaleWeightKg = BuffaloClassesAPI.reduce((acc, cur) => {
    const buffaloClass = buffalo.classes[cur];

    if (!buffaloClass) {
      return acc;
    }

    return acc + buffaloClass.headSold * buffaloClass.saleWeight;
  }, 0);

  return {
    output,
    extensions: {
      totalSaleWeightKg,
      carbonSequestration,
    },
    meta: {
      id,
    },
  };
}

export function calculateBuffalo(
  input: BuffaloInput,
  context: ExecutionContext<ConstantsForBuffaloCalculator>,
): BuffaloOutput {
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.buffalos,
    'buffaloProportion',
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    input.vegetation,
    'buffaloProportion',
    input.buffalos,
    context,
  );

  const buffaloResults = input.buffalos.map((singleBuffalo, ix) =>
    calculateSingleBuffalo(
      input.state,
      input.rainfallAbove600,
      singleBuffalo,
      context,
      carbonSequestration.intermediate[ix],
      singleBuffalo.id || ix.toString(),
    ),
  );

  const buffaloResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          fertiliserN2O: 0,
          atmosphericDepositionN2O: 0,
          manureManagementCH4: 0,
          entericCH4: 0,
          urineAndDungN2O: 0,
          leachingAndRunoffN2O: 0,
          fuelCO2: 0,
          fuelCH4: 0,
          fuelN2O: 0,
          totalCO2: 0,
          totalCH4: 0,
          totalN2O: 0,
          ureaCO2: 0,
          total: 0,
          limeCO2: 0,
        },
        scope2: {
          electricity: 0,
          total: 0,
        },
        scope3: {
          electricity: 0,
          fertiliser: 0,
          purchasedFeed: 0,
          fuel: 0,
          herbicide: 0,
          lime: 0,
          purchasedLivestock: 0,
          total: 0,
        },
        net: {
          total: 0,
        },
      },
      extensions: {
        totalSaleWeightKg: 0,
        carbonSequestration: 0,
      },
      meta: {
        id: '',
      },
    },
    buffaloResults,
  );

  const baseEmissions = {
    ...buffaloResult.output,
    net: {
      total:
        buffaloResult.output.scope1.total +
        buffaloResult.output.scope2.total +
        buffaloResult.output.scope3.total -
        carbonSequestration.total,
    },
  };

  const intensities = getEmissionsIntensities(
    baseEmissions.net.total,
    carbonSequestration.total,
    buffaloResult.extensions.totalSaleWeightKg,
  );

  return {
    ...baseEmissions,
    carbonSequestration,
    intensities,
    intermediate: buffaloResults.map((x) => {
      return {
        intensities: getEmissionsIntensities(
          x.output.net.total,
          x.extensions.carbonSequestration,
          x.extensions.totalSaleWeightKg,
        ),
        net: x.output.net,
        scope1: x.output.scope1,
        scope2: x.output.scope2,
        scope3: x.output.scope3,
        carbonSequestration: {
          total: x.extensions.carbonSequestration,
        },
        id: x.meta.id,
      };
    }),
  };
}
