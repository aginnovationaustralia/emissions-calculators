import { z } from 'zod';
import {
  PurchasedFeedLivestockInputSchema,
  PurchasedFeedLivestockInputTransformed,
} from './livestock-purchased-feed';
import {
  PurchasedFeedAquacultureInputTransformed,
  PurchasedFeedAquacultureInputSchema,
} from './aquaculture-purchased-feed';
import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
  PurchasedFeedLivestockType,
  PurchasedFeedLivestockTypes,
} from '@/constants/enums';
import {
  PurchasedFeedMethod2InputSchema,
  PurchasedFeedMethod2InputTransformed,
} from './method2-purchased-feed';

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

export const purchasedFeedIsAquaculture = (
  feed: PurchasedFeedMethod1InputTransformed,
): feed is PurchasedFeedAquacultureInputTransformed => {
  return PurchasedFeedAquacultureTypes.includes(
    feed.type.unit as PurchasedFeedAquacultureType,
  );
};

export const purchasedFeedIsLivestock = (
  feed: PurchasedFeedMethod1InputTransformed,
): feed is PurchasedFeedLivestockInputTransformed => {
  return PurchasedFeedLivestockTypes.includes(
    feed.type.unit as PurchasedFeedLivestockType,
  );
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
