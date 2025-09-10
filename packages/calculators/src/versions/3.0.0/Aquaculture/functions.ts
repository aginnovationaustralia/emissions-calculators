import { divideBySafeFromZero } from '../common/tools';

export function getIntensities(
  netTotal: number,
  offsetsTotal: number,
  totalHarvestWeightKg: number,
) {
  return {
    aquacultureExcludingCarbonOffsets: divideBySafeFromZero(
      (netTotal + offsetsTotal) * 1000,
      totalHarvestWeightKg,
    ),
    aquacultureIncludingCarbonOffsets: divideBySafeFromZero(
      netTotal * 1000,
      totalHarvestWeightKg,
    ),
    totalHarvestWeightKg,
  };
}
