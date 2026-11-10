import { object } from '@/types/schemas';
import { z } from 'zod';
import { PurchasedFeedInputSchema } from './purchased-feed.input';
import { PurchasedFeedAquacultureInputSchema } from './aquaculture-purchased-feed.input';
import { PurchasedFeedMethod2InputSchema } from './method2-purchased-feed.input';

export const HasPurchasedFeedInputSchema = object({
  purchasedFeed: z
    .array(PurchasedFeedInputSchema)
    .meta({ id: 'PurchasedFeedListInput' }),
});

/**
 * Purchased feed (bait) for Aquaculture and Wild catch fisheries: an aquaculture
 * feed type (Method 1) or a custom emissions factor (Method 2). Livestock feed
 * types are not accepted.
 */
export const HasAquaculturePurchasedFeedInputSchema = object({
  purchasedFeed: z
    .array(
      z.xor([
        PurchasedFeedAquacultureInputSchema,
        PurchasedFeedMethod2InputSchema,
      ]),
    )
    .meta({ id: 'AquaculturePurchasedFeedListInput' }),
});

export type HasPurchasedFeedInput = z.input<typeof HasPurchasedFeedInputSchema>;
export type HasPurchasedFeedInputTransformed = z.output<
  typeof HasPurchasedFeedInputSchema
>;
export type HasAquaculturePurchasedFeedInput = z.input<
  typeof HasAquaculturePurchasedFeedInputSchema
>;
export type HasAquaculturePurchasedFeedInputTransformed = z.output<
  typeof HasAquaculturePurchasedFeedInputSchema
>;
