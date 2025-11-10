import { DeerEmissionsIntensities } from '@/types/Deer/intensities.output';
import { divideBySafeFromZero } from '../common/tools';

export function getLeachingOtherDryland(
  otherFertiliserDryland: number,
  fracWetMultiplier: number,
  fracLEACH: number,
) {
  return otherFertiliserDryland * fracWetMultiplier * fracLEACH;
}

export function getIntensity(
  grossEmissions: number,
  sequestration: number,
  liveweightProducedKg: number,
): DeerEmissionsIntensities {
  const deerMeatExcludingSequestration = divideBySafeFromZero(
    grossEmissions * 1000,
    liveweightProducedKg,
  );
  const deerMeatIncludingSequestration = divideBySafeFromZero(
    (grossEmissions - sequestration) * 1000,
    liveweightProducedKg,
  );
  return {
    liveweightProducedKg,
    deerMeatExcludingSequestration,
    deerMeatIncludingSequestration,
  };
}
