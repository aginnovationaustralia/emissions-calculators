import { ExecutionContext } from '@/calculators/executionContext';
import { PurchasedFeedsInputTransformed } from './purchased-feeds.input';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';

export const calculatePurchasedFeed = (
  livestock: PurchasedFeedsInputTransformed,
  // TODO: Relocate purchased feed constants
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const { constants } = context;
  /**
   * 15.2.1.1 Method 1 — Purchased Feed
   * (1) Emissions from purchased feed 𝐸 (t CO2e) are calculated as:
   * 𝐸 = ∑ 𝑄𝑗 × 𝐸𝐹 𝑗
   */
  const emissionsFromPurchases = livestock.purchasedFeed.map((feed) => {
    const type = feed.type;
    const emissionsFactor =
      feed.customEmissionsFactor ??
      selectConstant(constants.COMMON, 'PURCHASED_FEED_FACTORS', type);
    return feed.amount.multiply(emissionsFactor);
  });

  return sum(emissionsFromPurchases);
};
