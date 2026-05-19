import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';

export const PurchasedFeedAquacultureInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: z
      .literal(PurchasedFeedAquacultureTypes)
      .transform((val) =>
        input('purchased feed type', val as PurchasedFeedAquacultureType),
      )
      .meta({
        description: 'The type of feed purchased.',
      }),
  });

export type PurchasedFeedAquacultureInput = z.input<
  typeof PurchasedFeedAquacultureInputSchema
>;
export type PurchasedFeedAquacultureInputTransformed = z.output<
  typeof PurchasedFeedAquacultureInputSchema
>;
