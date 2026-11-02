import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { captureMethod1Or2Value } from '@/tools/multi';
import { zeroCO2e } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { voidUnit } from '@/tools/units';
import { HasPurchasedFeedInputTransformed } from './has-purchased-feed.input';
import {
  purchasedFeedIsAustralian,
  purchasedFeedIsBrazilian,
  purchasedFeedIsNSW,
  purchasedFeedIsNT,
  purchasedFeedIsQLD,
  purchasedFeedIsSA,
  purchasedFeedIsTAS,
  purchasedFeedIsVIC,
  purchasedFeedIsWA,
} from './livestock-regional-purchased-feed.input';
import {
  PurchasedFeedInputTransformed,
  purchasedFeedIsMethod2,
  purchasedFeedIsRegionless,
  PurchasedFeedMethod1InputTransformed,
} from './purchased-feed.input';

const getEmissionsFactorForMethod1 = (
  feed: PurchasedFeedMethod1InputTransformed,
  constants: HasConstants<'LIVESTOCK'>,
) => {
  if (!purchasedFeedIsRegionless(feed)) {
    /**
     * NOTE: Typescript can't tell that the feed type is properly constrained for each region
     * already, to do this without ignoring type checking we have to do this one region at a time
     */
    if (purchasedFeedIsBrazilian(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsAustralian(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsNSW(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsNT(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsQLD(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsSA(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsTAS(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsVIC(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
    if (purchasedFeedIsWA(feed)) {
      return selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regional',
        feed.region,
        feed.type,
      );
    }
  }
  return selectConstant(
    constants.LIVESTOCK,
    'PURCHASED_FEED_FACTORS',
    'regionless',
    feed.type,
  );
};

const getEmissionsFactor = (
  feed: PurchasedFeedInputTransformed,
  constants: HasConstants<'LIVESTOCK'>,
) => {
  if (purchasedFeedIsMethod2(feed)) {
    return captureMethod1Or2Value(voidUnit(), feed.customEmissionsFactor);
  }
  return captureMethod1Or2Value(
    getEmissionsFactorForMethod1(feed, constants),
    undefined,
  );
};

export const calculatePurchasedFeed = (
  { purchasedFeed }: HasPurchasedFeedInputTransformed,
  context: ExecutionContext<HasConstants<'COMMON' | 'LIVESTOCK'>>,
) => {
  const { constants } = context;
  /**
   * 15.2.1.1 Method 1 -- Purchased Feed
   * (1) Emissions from purchased feed E (t CO2e) are calculated as:
   * E = SUM Qj * EFj
   */
  const emissionsFromPurchases = purchasedFeed.map((feed) => {
    const EFj = getEmissionsFactor(feed, constants).named('EFj');
    return feed.amount.multiply(EFj).reference('15.2.1.1 (1)');
  });

  return sum(emissionsFromPurchases, zeroCO2e);
};
