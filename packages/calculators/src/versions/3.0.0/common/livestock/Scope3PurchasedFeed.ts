import { ExecutionContext } from '../../executionContext';

// (dataInputBeefD98)
/**
 * For sheep, cottonseed is always 0.
 * @param grain
 * @param hay
 * @param cottonseed
 * @returns
 */
export function calculateScope3PurchasedFeed(
  grain: number,
  hay: number,
  cottonseed: number,
  context: ExecutionContext,
) {
  const { constants } = context;

  // grain
  const grainTotalGHG = grain * constants.COMMON.FEED_PURCHASED.grain.TotalGHG;

  // hay
  const hayTotalGHG = hay * constants.COMMON.FEED_PURCHASED.hay.TotalGHG;

  // cottonseed
  const cottonseedTotalGHG =
    cottonseed * constants.COMMON.FEED_PURCHASED.cottonseed.TotalGHG;

  const totalEmissionsPurchasedFeed =
    grainTotalGHG + hayTotalGHG + cottonseedTotalGHG;

  return {
    grain: grainTotalGHG,
    hay: hayTotalGHG,
    cottonseed: cottonseedTotalGHG,
    total: totalEmissionsPurchasedFeed,
  };
}
