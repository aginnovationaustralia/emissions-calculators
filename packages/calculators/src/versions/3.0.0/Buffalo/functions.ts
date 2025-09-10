import { divideBySafeFromZero } from '../common/tools';

export function getLeachingOtherDryland(
  otherFertiliserDryland: number,
  fracWetMultiplier: number,
  fracLEACH: number,
) {
  return otherFertiliserDryland * fracWetMultiplier * fracLEACH;
}

export function getEmissionsIntensities(
  netTotal: number,
  sequestration: number,
  liveweightProducedKg: number,
) {
  const excludingTonnesPerHectare = divideBySafeFromZero(
    netTotal + sequestration,
    liveweightProducedKg,
  );
  const includingTonnesPerHectare = divideBySafeFromZero(
    netTotal,
    liveweightProducedKg,
  );

  return {
    buffaloMeatExcludingSequestration: excludingTonnesPerHectare * 1000,
    buffaloMeatIncludingSequestration: includingTonnesPerHectare * 1000,
    liveweightProducedKg,
  };
}
