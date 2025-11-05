import { ExecutionContext } from '../../executionContext';

export function calculateScope3PurchasedFeed(
  grain: number,
  hay: number,
  cottonseed: number,
  context: ExecutionContext,
) {
  const { constants } = context;

  const grainTotalGHG = grain * constants.COMMON.FEED_PURCHASED.grain.TotalGHG;

  const hayTotalGHG = hay * constants.COMMON.FEED_PURCHASED.hay.TotalGHG;

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
