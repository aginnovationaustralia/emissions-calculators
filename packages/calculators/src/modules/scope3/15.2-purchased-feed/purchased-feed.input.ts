import { z } from 'zod';
import {
  PurchasedFeedLivestockRegionlessInputSchema,
  PurchasedFeedLivestockRegionlessInputTransformed,
} from './livestock-regionless-purchased-feed.input';
import {
  PurchasedFeedAquacultureInputTransformed,
  PurchasedFeedAquacultureInputSchema,
} from './aquaculture-purchased-feed.input';
import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
} from '@/constants/enums';
import {
  PurchasedFeedMethod2InputSchema,
  PurchasedFeedMethod2InputTransformed,
} from './method2-purchased-feed.input';
import {
  PurchasedFeedLivestockRegionalInputSchema,
  PurchasedFeedLivestockRegionalInputTransformed,
} from './livestock-regional-purchased-feed.input';

export const PurchasedFeedLivestockInputSchema = z.discriminatedUnion('type', [
  PurchasedFeedLivestockRegionlessInputSchema,
  PurchasedFeedLivestockRegionalInputSchema,
]);

export type PurchasedFeedLivestockInput = z.input<
  typeof PurchasedFeedLivestockInputSchema
>;
export type PurchasedFeedLivestockInputransformed = z.output<
  typeof PurchasedFeedLivestockInputSchema
>;

export const PurchasedFeedMethod1InputSchema = z.discriminatedUnion('type', [
  PurchasedFeedLivestockInputSchema,
  PurchasedFeedAquacultureInputSchema,
]);

export type PurchasedFeedMethod1Input = z.input<
  typeof PurchasedFeedMethod1InputSchema
>;
export type PurchasedFeedMethod1InputTransformed = z.output<
  typeof PurchasedFeedMethod1InputSchema
>;

export const PurchasedFeedInputSchema = z.xor([
  PurchasedFeedMethod1InputSchema,
  PurchasedFeedMethod2InputSchema,
]);

export type PurchasedFeedInput = z.input<typeof PurchasedFeedInputSchema>;
export type PurchasedFeedInputTransformed = z.output<
  typeof PurchasedFeedInputSchema
>;

export const purchasedFeedIsRegionless = (
  feed: PurchasedFeedInputTransformed,
): feed is
  | PurchasedFeedAquacultureInputTransformed
  | PurchasedFeedLivestockRegionlessInputTransformed => {
  return (
    (feed as PurchasedFeedLivestockRegionalInputTransformed).region ===
    undefined
  );
};

export const purchasedFeedIsRegional = (
  feed: PurchasedFeedInputTransformed,
): feed is PurchasedFeedLivestockRegionalInputTransformed => {
  return (
    (feed as PurchasedFeedLivestockRegionalInputTransformed).region !==
    undefined
  );
};

export const purchasedFeedIsAquaculture = (
  feed: PurchasedFeedMethod1InputTransformed,
): feed is PurchasedFeedAquacultureInputTransformed => {
  return PurchasedFeedAquacultureTypes.includes(
    feed.type.unit as PurchasedFeedAquacultureType,
  );
};

export const purchasedFeedIsLivestock = (
  feed: PurchasedFeedMethod1InputTransformed,
): feed is PurchasedFeedLivestockInputransformed => {
  return !purchasedFeedIsAquaculture(feed);
};

export const purchasedFeedIsMethod1 = (
  feed: PurchasedFeedInputTransformed,
): feed is PurchasedFeedMethod1InputTransformed => {
  return (feed as PurchasedFeedMethod1InputTransformed).type !== undefined;
};

export const purchasedFeedIsMethod2 = (
  feed: PurchasedFeedInputTransformed,
): feed is PurchasedFeedMethod2InputTransformed => {
  return (
    (feed as PurchasedFeedMethod2InputTransformed).customEmissionsFactor !==
    undefined
  );
};
