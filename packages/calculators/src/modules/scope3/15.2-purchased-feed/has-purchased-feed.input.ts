import { object } from '@/types/schemas';
import { z } from 'zod';
import { PurchasedFeedInputSchema } from './purchased-feed.input';
import { PurchasedFeedAquacultureInputSchema } from './aquaculture-purchased-feed.input';

export const HasPurchasedFeedInputSchema = object({
  purchasedFeed: z
    .array(PurchasedFeedInputSchema)
    .meta({ id: 'PurchasedFeedListInput' }),
});

export const HasAquaculturePurchasedFeedInputSchema = object({
  purchasedFeed: z.array(PurchasedFeedAquacultureInputSchema),
});

export type HasPurchasedFeedInput = z.input<typeof HasPurchasedFeedInputSchema>;
export type HasPurchasedFeedInputTransformed = z.output<
  typeof HasPurchasedFeedInputSchema
>;
