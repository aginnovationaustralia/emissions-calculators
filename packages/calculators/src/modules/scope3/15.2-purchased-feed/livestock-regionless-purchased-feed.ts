import {
  PurchasedFeedLivestockRegionlessTypes,
  PurchasedFeedLivestockRegionlessType,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';

/**
 * Purchased feed inputs that do not require a region to be specified.
 */
export const PurchasedFeedLivestockRegionlessInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: z
      .literal(PurchasedFeedLivestockRegionlessTypes)
      .transform((val) =>
        input(
          'purchased feed type',
          val as PurchasedFeedLivestockRegionlessType,
        ),
      )
      .meta({
        description: 'The type of feed purchased.',
      }),
  });
export type PurchasedFeedLivestockRegionlessInput = z.input<
  typeof PurchasedFeedLivestockRegionlessInputSchema
>;
export type PurchasedFeedLivestockRegionlessInputTransformed = z.output<
  typeof PurchasedFeedLivestockRegionlessInputSchema
>;
