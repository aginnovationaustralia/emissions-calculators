import { ExecutionContext } from '@/calculators/executionContext';
import { PurchasedFeedsInputTransformed } from './purchased-feeds.input';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import { purchasedFeedIsMethod1 } from './purchased-feed.input';

export const calculatePurchasedFeed = (
  { purchasedFeed }: PurchasedFeedsInputTransformed,
  // TODO: Relocate purchased feed constants
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /**
   * 15.2.1.1 Method 1 — Purchased Feed
   * (1) Emissions from purchased feed 𝐸 (t CO2e) are calculated as:
   * 𝐸 = ∑ 𝑄𝑗 × 𝐸𝐹 𝑗
   */
  const emissionsFromPurchases = purchasedFeed.map((feed) => {
    const emissionsFactor = purchasedFeedIsMethod1(feed)
      ? selectConstant(constants.COMMON, 'PURCHASED_FEED_FACTORS', feed.type)
      : feed.customEmissionsFactor;
    return feed.amount.multiply(emissionsFactor);
  });

  return sum(emissionsFromPurchases);
};
