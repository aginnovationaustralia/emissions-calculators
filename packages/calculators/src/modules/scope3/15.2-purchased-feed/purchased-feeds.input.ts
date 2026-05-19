import { object } from '@/types/schemas';
import { z } from 'zod';
import { PurchasedFeedInputSchema } from './purchased-feed.input';

export const PurchasedFeedsInputSchema = object({
  purchasedFeed: z.array(PurchasedFeedInputSchema),
});

export type PurchasedFeedsInput = z.input<typeof PurchasedFeedsInputSchema>;
export type PurchasedFeedsInputTransformed = z.output<
  typeof PurchasedFeedsInputSchema
>;
