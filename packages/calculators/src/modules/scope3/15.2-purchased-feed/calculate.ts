import { ExecutionContext } from '@/calculators/executionContext';
import { PurchasedFeedsInputTransformed } from './purchased-feeds.input';
import { selectConstant } from '@/tools/constants';
import { sum } from '@/tools/sum';
import {
  purchasedFeedIsMethod2,
  purchasedFeedIsRegionless,
} from './purchased-feed.input';
import { AllConstants } from '@/constants/types';
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

export const calculatePurchasedFeed = (
  { purchasedFeed }: PurchasedFeedsInputTransformed,
  // TODO: Relocate purchased feed constants
  context: ExecutionContext<AllConstants>,
) => {
  const { constants } = context;
  /**
   * 15.2.1.1 Method 1 -- Purchased Feed
   * (1) Emissions from purchased feed E (t CO2e) are calculated as:
   * E = SUM Qj * EFj
   */
  const emissionsFromPurchases = purchasedFeed.map((feed) => {
    if (purchasedFeedIsMethod2(feed)) {
      return feed.amount.multiply(feed.customEmissionsFactor);
    }
    if (!purchasedFeedIsRegionless(feed)) {
      /**
       * REVISIT: Typescript can't tell that the feed type is properly constrained for each region
       * already, to do this without ignoring type checking we have to do this one region at a time
       */
      if (purchasedFeedIsBrazilian(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsAustralian(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsNSW(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsNT(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsQLD(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsSA(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsTAS(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsVIC(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
      if (purchasedFeedIsWA(feed)) {
        return feed.amount.multiply(
          selectConstant(
            constants.LIVESTOCK,
            'PURCHASED_FEED_FACTORS',
            'regional',
            feed.region,
            feed.type,
          ),
        );
      }
    }
    return feed.amount.multiply(
      selectConstant(
        constants.LIVESTOCK,
        'PURCHASED_FEED_FACTORS',
        'regionless',
        feed.type,
      ),
    );
  });

  return sum(emissionsFromPurchases);
};
