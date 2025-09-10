import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { FeedlotSystem } from '../types/types';

export function getFeedlotProductionSystemEF(
  system: FeedlotSystem,
  context: ExecutionContext,
) {
  const { constants } = context;

  return constants.FEEDLOT_MANURE_EF[system].EF;
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
    beefExcludingSequestration: excludingTonnesPerHectare * 1000,
    beefIncludingSequestration: includingTonnesPerHectare * 1000,
    liveweightProducedKg,
  };
}
