import {
  PurchasedFeedLivestockRegionlessType,
  PurchasedFeedLivestockRegionlessTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { PURCH_FEED_15_2 } from '@/tools/modules';
import { enumSchema } from '@/tools/enum-schemas';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';

/**
 * Purchased feed inputs that do not require a region to be specified.
 */
export const PurchasedFeedLivestockRegionlessInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: enumSchema(PurchasedFeedLivestockRegionlessTypes)
      .transform((val) =>
        input(val as PurchasedFeedLivestockRegionlessType, {
          name: 'purchased feed type',
          modules: [PURCH_FEED_15_2],
        }),
      )
      .meta({
        description: 'The type of feed purchased.',
      }),
  }).meta({ title: 'Regionless feed type' });
export type PurchasedFeedLivestockRegionlessInput = z.input<
  typeof PurchasedFeedLivestockRegionlessInputSchema
>;
export type PurchasedFeedLivestockRegionlessInputTransformed = z.output<
  typeof PurchasedFeedLivestockRegionlessInputSchema
>;
