import { LandUseChangeActivityInput, LULUCFInput } from '@/modules/lulucf';
import { FullCAMAreaInput } from './input';
import type { FullCAMOutputSummary } from './types';

type FullCAMPair = {
  areaInput: FullCAMAreaInput;
  summary: FullCAMOutputSummary;
};
/**
 * Maps FullCAM simulation output into the emissions package `landUse` shape. The key values that can be extracted from the
 * FullCAM simulation results are inserted into simple 'token' activities, for the calculator to consume and inject into the
 * appropriate chapters of the guidelines.
 */
export function generateLulucfInput(pairs: FullCAMPair[]): LULUCFInput {
  // Create activities that can receive the interesting values extracted from a simulation output
  const activities = pairs.flatMap(({ areaInput, summary }) => {
    const burningActivity: LandUseChangeActivityInput = {
      type: 'landClearingForestToCropland',
      carbonMassInTreesCurrentYear: 0,
      carbonMassInTreesPreviousYear: 0,
      carbonMassInDebrisCurrentYear: 0,
      carbonMassInDebrisPreviousYear: 0,
      massCH4FromBiomassBurningPerHectare:
        summary.ch4FromBiomassBurningPerHectare,
      massN2OFromBiomassBurningPerHectare:
        summary.n2oFromBiomassBurningPerHectare,
      activityAreaHectares: areaInput.areaHectares,
      areaBurnt: areaInput.areaHectares,
      region: areaInput.region,
    };

    const plantingActivity: LandUseChangeActivityInput = {
      type: 'landClearingForestToCropland',
      carbonMassInTreesCurrentYear: summary.carbonMassInTreesPerHectare,
      carbonMassInTreesPreviousYear:
        summary.carbonMassInTreesPerHectarePrevYear,
      carbonMassInDebrisCurrentYear: summary.carbonMassInDebrisPerHectare,
      carbonMassInDebrisPreviousYear:
        summary.carbonMassInDebrisPerHectarePrevYear,
      massCH4FromBiomassBurningPerHectare: 0,
      massN2OFromBiomassBurningPerHectare: 0,
      activityAreaHectares: areaInput.areaHectares,
      areaBurnt: 0,
      region: areaInput.region,
    };

    const forestryActivity: LandUseChangeActivityInput = {
      type: 'farmForestry',
      carbonMassOfWoodProductsHarvestedPerHectare:
        summary.carbonMassInForestProductsPerHectare,
      activityAreaHectares: areaInput.areaHectares,
      carbonMassInTreesCurrentYear: 0,
      carbonMassInTreesPreviousYear: 0,
      carbonMassInDebrisCurrentYear: 0,
      carbonMassInDebrisPreviousYear: 0,
    };

    return [burningActivity, plantingActivity, forestryActivity];
  });

  // Pass through savanna burning and perennial crops, these have not been passed into a FullCAM request. They just go straight through to the calculator.
  const burning = pairs.flatMap(
    ({ areaInput }) => areaInput.savannaBurning ?? [],
  );
  const perennialCrops = pairs.flatMap(
    ({ areaInput }) => areaInput.perennialCrops ?? [],
  );

  const result: LULUCFInput = {
    isInLeachingZone: false, // TODO
    rainfallAbove600: false, // TODO
    activities,
    burning,
    perennialCrops,
  };

  return result;
}
