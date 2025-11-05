import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
  calculateScope3FuelWithLPGAverage,
} from '../common-legacy/fuel';
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
import { DeerComplete } from '../types/Deer/deer.input';
import { DeerInput } from '../types/Deer/input';
import { DeerOutput } from '../types/Deer/output';
import { DeerClassesAPI, State } from '../types/types';
import { ConstantsForDeerCalculator } from './constants';
import { getIntensity } from './functions';
import { calculateScope1 } from './Scope1Deer';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3PurchaseLivestock } from './Scope3PurchasedLivestock';

/**
 * Entire calculator for deer
 * @param state
 * @param rainfallAbove600
 * @param deer
 * @returns
 */
export function calculateSingleDeer(
  state: State,
  rainfallAbove600: boolean,
  deer: DeerComplete,
  context: ExecutionContext<ConstantsForDeerCalculator>,
  carbonSequestration: number,
  id: string,
) {
  const mergedFertiliser = mergeOtherFertilisers(deer.fertiliser);

  const deerEmissions = calculateScope1(
    deer,
    mergedFertiliser,
    rainfallAbove600,
    state,
    context,
  );

  const limeCO2 = calculateScope1Lime(
    deer.limestone,
    deer.limestoneFraction,
    context,
  );

  const fuelCO2 = calculateFuelScope1CO2LPG(
    deer.diesel,
    deer.petrol,
    deer.lpg,
    context,
    true,
  );
  const fuelCH4 = calculateFuelScope1CH4LPG(
    deer.diesel,
    deer.petrol,
    deer.lpg,
    context,
    true,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    deer.diesel,
    deer.petrol,
    deer.lpg,
    context,
    true,
  );

  const ureaCO2 = calculateScope1Urea(mergedFertiliser, context);

  const electricity = calculateElectricityScope2And3(
    state,
    deer.electricitySource,
    deer.electricityRenewable,
    deer.electricityUse,
    context,
  );

  const fertiliser = calculateScope3Fertiliser(mergedFertiliser, context);

  const feed = calculateScope3PurchasedFeed(
    deer.grainFeed,
    deer.hayFeed,
    0,
    context,
  );

  const fuelScope3 = calculateScope3FuelWithLPGAverage(
    deer.diesel,
    deer.petrol,
    deer.lpg,
    context,
  );

  const herbicide = calculateScope3Herbicide(
    deer.herbicide,
    deer.herbicideOther,
    context,
  );

  const lime = calculateScope3Lime(deer.limestone, context);

  const purchasedLivestock = calculateScope3PurchaseLivestock(
    deer.classes,
    context,
  );

  const totalCO2 = fuelCO2 + ureaCO2 + limeCO2;
  const totalCH4 =
    fuelCH4 + deerEmissions.manureMethane + deerEmissions.totalMethaneEnteric;
  const totalN2O =
    deerEmissions.totalFertiliserSoil +
    deerEmissions.atmosphericN2O +
    deerEmissions.totalUrineDung +
    deerEmissions.totalLeachingN2O +
    fuelN2O;

  const scope1 = addTotalValue({
    fertiliserN2O: deerEmissions.totalFertiliserSoil,
    atmosphericDepositionN2O: deerEmissions.atmosphericN2O,
    manureManagementCH4: deerEmissions.manureMethane,
    entericCH4: deerEmissions.totalMethaneEnteric,
    urineAndDungN2O: deerEmissions.totalUrineDung,
    leachingAndRunoffN2O: deerEmissions.totalLeachingN2O,
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

  const totalSaleWeightKg = DeerClassesAPI.reduce((acc, cur) => {
    const deerClass = deer.classes[cur];
    if (!deerClass) {
      return acc;
    }
    return acc + deerClass.headSold * deerClass.saleWeight;
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

export function calculateDeer(
  input: DeerInput,
  context: ExecutionContext<ConstantsForDeerCalculator>,
): DeerOutput {
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.deers,
    'deerProportion',
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    input.vegetation,
    'deerProportion',
    input.deers,
    context,
  );

  const deerResults = input.deers.map((singleDeer, ix) =>
    calculateSingleDeer(
      input.state,
      input.rainfallAbove600,
      singleDeer,
      context,
      carbonSequestration.intermediate[ix],
      singleDeer.id || ix.toString(),
    ),
  );

  const deerResult = sumIntermediateResults(
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
    deerResults,
  );

  const scopeTotals =
    deerResult.output.scope1.total +
    deerResult.output.scope2.total +
    deerResult.output.scope3.total;

  const intensities = getIntensity(
    scopeTotals,
    carbonSequestration.total,
    deerResult.extensions.totalSaleWeightKg,
  );

  return {
    net: {
      total: scopeTotals - carbonSequestration.total,
    },
    scope1: deerResult.output.scope1,
    scope2: deerResult.output.scope2,
    scope3: deerResult.output.scope3,
    carbonSequestration: {
      total: deerResult.extensions.carbonSequestration,
      intermediate: carbonSequestration.intermediate,
    },
    intensities,
    intermediate: deerResults.map((result) => ({
      ...result.output,
      id: result.meta.id,
      carbonSequestration: {
        total: result.extensions.carbonSequestration,
      },
      intensities: getIntensity(
        result.output.scope1.total +
          result.output.scope2.total +
          result.output.scope3.total,
        result.extensions.carbonSequestration,
        result.extensions.totalSaleWeightKg,
      ),
    })),
  };
}
