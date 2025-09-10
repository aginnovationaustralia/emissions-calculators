import { divideBySafeFromZero } from '../common/tools';

export function getIntensities(
  netTotal: number,
  offsetsTotal: number,
  totalHarvestWeightKg: number,
) {
  return {
    wildCatchFisheryExcludingCarbonOffsets: divideBySafeFromZero(
      (netTotal + offsetsTotal) * 1000,
      totalHarvestWeightKg,
    ),
    wildCatchFisheryIncludingCarbonOffsets: divideBySafeFromZero(
      netTotal * 1000,
      totalHarvestWeightKg,
    ),
    totalHarvestWeightKg,
  };
}
