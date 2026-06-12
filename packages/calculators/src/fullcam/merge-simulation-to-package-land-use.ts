import { LandUseChangeActivityInput, LULUCFInput } from '@/modules/lulucf';
import type { InputAreaWithOutputKeyFields } from './types';

/**
 * Maps FullCAM simulation output into the emissions package `landUse` shape. The key values that can be extracted from the
 * FullCAM simulation results are inserted into simple 'token' activities, for the calculator to consume and inject into the
 * appropriate chapters of the guidelines.
 */
export function generateLulucfInput(
  pairs: InputAreaWithOutputKeyFields[],
): LULUCFInput {
  // Create activities that can receive the interesting values extracted from a simulation output
  const activities = pairs.flatMap(({ area, keyFields }) => {
    const burningActivity: LandUseChangeActivityInput = {
      type: 'landClearingForestToCropland',
      carbonMassInTreesCurrentYear: 0,
      carbonMassInTreesPreviousYear: 0,
      carbonMassInDebrisCurrentYear: 0,
      carbonMassInDebrisPreviousYear: 0,
      massCH4FromBiomassBurningPerHectare:
        keyFields.ch4FromBiomassBurningPerHectare,
      massN2OFromBiomassBurningPerHectare:
        keyFields.n2oFromBiomassBurningPerHectare,
      activityAreaHectares: area.input.areaHectares,
      areaBurnt: area.input.areaHectares,
      region: area.input.region,
    };

    const plantingActivity: LandUseChangeActivityInput = {
      type: 'landClearingForestToCropland',
      carbonMassInTreesCurrentYear: keyFields.carbonMassInTreesPerHectare,
      carbonMassInTreesPreviousYear:
        keyFields.carbonMassInTreesPerHectarePrevYear,
      carbonMassInDebrisCurrentYear: keyFields.carbonMassInDebrisPerHectare,
      carbonMassInDebrisPreviousYear:
        keyFields.carbonMassInDebrisPerHectarePrevYear,
      massCH4FromBiomassBurningPerHectare: 0,
      massN2OFromBiomassBurningPerHectare: 0,
      activityAreaHectares: area.input.areaHectares,
      areaBurnt: 0,
      region: area.input.region,
    };

    const forestryActivity: LandUseChangeActivityInput = {
      type: 'farmForestry',
      carbonMassOfWoodProductsHarvestedPerHectare:
        keyFields.carbonMassInForestProductsPerHectare,
      activityAreaHectares: area.input.areaHectares,
      carbonMassInTreesCurrentYear: 0,
      carbonMassInTreesPreviousYear: 0,
      carbonMassInDebrisCurrentYear: 0,
      carbonMassInDebrisPreviousYear: 0,
    };

    return [burningActivity, plantingActivity, forestryActivity];
  });

  // Pass through savanna burning and perennial crops, these have not been passed into a FullCAM request. They just go straight through to the calculator.
  const burning = pairs.flatMap(({ area }) => area.input.savannaBurning ?? []);
  const perennialCrops = pairs.flatMap(
    ({ area }) => area.input.perennialCrops ?? [],
  );

  const result: LULUCFInput = {
    activities,
    burning,
    perennialCrops,
  };

  return result;
}
