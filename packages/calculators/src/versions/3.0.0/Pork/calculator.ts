import { calculateElectricityScope2And3 } from '../common-legacy/electricity';
import {
  calculateFuelScope1CH4LPG,
  calculateFuelScope1CO2LPG,
  calculateFuelScope1N2OLPG,
} from '../common-legacy/fuel';
import {
  calculateScope3Fertiliser,
  mergeOtherFertilisers,
} from '../common/fertiliser';
import { calculateScope3Herbicide } from '../common/herbicide';
import { calculateScope1Lime, calculateScope3Lime } from '../common/lime';
import { addTotalValue, divideBySafeFromZero } from '../common/tools';
import { sumIntermediateResults } from '../common/tools/intermediate-results';
import { singleAllocationToArray } from '../common/tools/object';
import { calculateAllCarbonSequestrationWithKeyProportion } from '../common/trees';
import { ExecutionContext } from '../executionContext';
import { PorkInput } from '../types/Pork/input';
import { PorkOutput } from '../types/Pork/output';
import { PorkComplete } from '../types/Pork/pork.input';
import { PorkClasses } from '../types/Pork/porkclasses.input';
import { State } from '../types/types';
import { calculateScope1Enteric } from './Scope1Enteric';
import { calculateScope1Fertiliser } from './Scope1Fertiliser';
import { calculateScope1Manure } from './Scope1Manure';
import { calculateScope1N2O } from './Scope1N2O';
import { calculateScope1Urea } from './Scope1Urea';
import { calculateScope3PurchasedFeed } from './Scope3PurchasedFeed';
import { calculateScope3PurchasedLivestock } from './Scope3PurchasedLivestock';
import { calculateScope3Bedding, getScope3FuelFunction } from './functions';

function getIntensities(
  netTotalTonnes: number,
  carbonSequestrationTonnes: number,
  liveweightProducedKg: number,
) {
  return {
    porkMeatExcludingSequestration: divideBySafeFromZero(
      (netTotalTonnes + carbonSequestrationTonnes) * 1000,
      liveweightProducedKg,
    ),
    porkMeatIncludingSequestration: divideBySafeFromZero(
      netTotalTonnes * 1000,
      liveweightProducedKg,
    ),
    liveweightProducedKg,
  };
}

/**
 * Entire calculator for Pork
 * @param state
 * @param propertyNorthOfTropicOfCapricorn
 * @param rainfallAbove600
 * @param beef
 * @param sheep
 * @returns
 */
export function calculateSinglePork(
  state: State,
  propertyNorthOfTropicOfCapricorn: boolean,
  rainfallAbove600: boolean,
  pork: PorkComplete,
  context: ExecutionContext,
  carbonSequestration: number,
  id: string,
) {
  // before doing anything, lets combine the fertilisers as we are doing a new
  // form of input for these

  const fixedClasses = {
    ...pork.classes,
    slaughter_pigs: pork.classes.slaughterPigs,
  };

  const mergedFertiliser = mergeOtherFertilisers(pork.fertiliser);

  const scope1N2O = calculateScope1N2O(
    state,
    fixedClasses,
    mergedFertiliser,
    rainfallAbove600,
    context,
  );

  const scope1ManureCH4 = calculateScope1Manure(state, fixedClasses, context);

  const scope1Enteric = calculateScope1Enteric(fixedClasses, context);

  const scope1Urea = calculateScope1Urea(mergedFertiliser, context);

  const scope1Fertiliser = calculateScope1Fertiliser(mergedFertiliser, context);

  // Lime
  const scope1Lime = calculateScope1Lime(
    pork.limestone,
    pork.limestoneFraction,
    context,
  );

  // Fuel

  // WARNING: in the sheet, FuelD6 refers to J18 for scope1 CO2 EF but should
  // refer to J19
  const fuelCO2 = calculateFuelScope1CO2LPG(
    pork.diesel,
    pork.petrol,
    pork.lpg,
    context,
  );
  const fuelCH4 = calculateFuelScope1CH4LPG(
    pork.diesel,
    pork.petrol,
    pork.lpg,
    context,
  );
  const fuelN2O = calculateFuelScope1N2OLPG(
    pork.diesel,
    pork.petrol,
    pork.lpg,
    context,
  );

  // Electricity

  const electricity = calculateElectricityScope2And3(
    state,
    pork.electricitySource,
    pork.electricityRenewable,
    pork.electricityUse,
    context,
  );

  // Fertiliser

  const fertiliser = calculateScope3Fertiliser(mergedFertiliser, context);

  const herbicide = calculateScope3Herbicide(
    pork.herbicide,
    pork.herbicideOther,
    context,
  );

  const limeScope3 = calculateScope3Lime(pork.limestone, context);

  const scope3Feed = calculateScope3PurchasedFeed(pork.feedProducts, context);

  const fuelScope3 = getScope3FuelFunction(
    context,
    pork.diesel,
    pork.petrol,
    pork.lpg,
  );

  const purchasedLivestock = calculateScope3PurchasedLivestock(
    pork.classes,
    context,
  );

  const bedding = calculateScope3Bedding(pork, context);

  // TODO: update these and check if they add everything
  const totalCO2 = fuelCO2 + scope1Urea + scope1Lime;
  const totalCH4 = fuelCH4 + scope1ManureCH4 + scope1Enteric;
  const totalN2O =
    fuelN2O +
    scope1Fertiliser +
    scope1N2O.leachingSoilN2O +
    scope1N2O.leachingMMSN2O +
    scope1N2O.atmosphericN2O +
    scope1N2O.atmosphericIndirectN2O +
    scope1N2O.manureDirectN2O;

  // totals

  const scope1 = addTotalValue({
    leachingAndRunoffSoilN2O: scope1N2O.leachingSoilN2O,
    leachingAndRunoffMMSN2O: scope1N2O.leachingMMSN2O,
    atmosphericDepositionN2O: scope1N2O.atmosphericN2O,
    atmosphericDepositionIndirectN2O: scope1N2O.atmosphericIndirectN2O,
    manureManagementCH4: scope1ManureCH4,
    manureManagementDirectN2O: scope1N2O.manureDirectN2O,
    entericCH4: scope1Enteric,
    fertiliserN2O: scope1Fertiliser,
    limeCO2: scope1Lime,
    fuelCO2,
    fuelCH4,
    fuelN2O,
    ureaCO2: scope1Urea,
    totalCO2,
    totalCH4,
    totalN2O,
  });

  const scope2 = addTotalValue({
    electricity: electricity.scope2,
  });

  const scope3 = addTotalValue({
    fertiliser,
    purchasedFeed: scope3Feed,
    herbicide: herbicide.total,
    electricity: electricity.scope3,
    fuel: fuelScope3,
    lime: limeScope3,
    purchasedLivestock,
    bedding,
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

  const totalSaleWeightKg = Object.keys(pork.classes).reduce((acc, key) => {
    const porkClassKey = key as keyof PorkClasses;
    const currentClass = pork.classes[porkClassKey];
    if (!currentClass) {
      return acc;
    }

    return acc + currentClass.headSold * currentClass.saleWeight;
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

export function calculatePork(
  input: PorkInput,
  context: ExecutionContext,
): PorkOutput {
  // eslint-disable-next-line no-param-reassign
  input.vegetation = singleAllocationToArray(
    input.vegetation,
    input.pork,
    'allocatedProportion',
  );

  const carbonSequestration = calculateAllCarbonSequestrationWithKeyProportion(
    input.vegetation,
    'allocatedProportion',
    input.pork,
    context,
  );

  const porkResults = input.pork.map((singlePork, ix) =>
    calculateSinglePork(
      input.state,
      input.northOfTropicOfCapricorn,
      input.rainfallAbove600,
      singlePork,
      context,
      carbonSequestration.intermediate[ix],
      singlePork.id || ix.toString(),
    ),
  );

  const porkResult = sumIntermediateResults(
    {
      output: {
        scope1: {
          atmosphericDepositionIndirectN2O: 0,
          atmosphericDepositionN2O: 0,
          entericCH4: 0,
          fertiliserN2O: 0,
          fuelCH4: 0,
          fuelCO2: 0,
          fuelN2O: 0,
          leachingAndRunoffMMSN2O: 0,
          leachingAndRunoffSoilN2O: 0,
          limeCO2: 0,
          manureManagementCH4: 0,
          manureManagementDirectN2O: 0,
          totalCH4: 0,
          totalCO2: 0,
          totalN2O: 0,
          ureaCO2: 0,
          total: 0,
        },
        scope2: {
          electricity: 0,
          total: 0,
        },
        scope3: {
          electricity: 0,
          fertiliser: 0,
          fuel: 0,
          herbicide: 0,
          lime: 0,
          purchasedFeed: 0,
          purchasedLivestock: 0,
          bedding: 0,
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
    porkResults,
  );

  const baseEmissions = {
    ...porkResult.output,
    net: {
      total:
        porkResult.output.scope1.total +
        porkResult.output.scope2.total +
        porkResult.output.scope3.total -
        carbonSequestration.total,
    },
  };

  const intensities = getIntensities(
    baseEmissions.net.total,
    carbonSequestration.total,
    porkResult.extensions.totalSaleWeightKg,
  );

  return {
    ...baseEmissions,
    carbonSequestration,
    intensities,
    intermediate: porkResults.map((x) => {
      return {
        intensities: getIntensities(
          x.output.net.total,
          x.extensions.carbonSequestration,
          x.extensions.totalSaleWeightKg,
        ),
        net: x.output.net,
        scope1: x.output.scope1,
        scope2: x.output.scope2,
        scope3: x.output.scope3,
        carbonSequestration: x.extensions.carbonSequestration,
        id: x.meta.id,
      };
    }),
  };
}
