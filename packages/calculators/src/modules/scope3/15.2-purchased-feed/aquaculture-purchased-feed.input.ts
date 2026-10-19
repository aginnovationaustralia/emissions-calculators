import { PurchasedFeedAquacultureTypes } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { PURCH_FEED_15_2 } from '@/tools/modules';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';

export const PurchasedFeedAquacultureInputSchema =
  BasePurchasedFeedInputSchema.extend({
    type: enumInput(PurchasedFeedAquacultureTypes, {
      name: 'purchased feed type',
      description: 'The type of feed purchased.',
      modules: [PURCH_FEED_15_2],
    }),
  }).meta({ title: 'Aquaculture feed' });

export type PurchasedFeedAquacultureInput = z.input<
  typeof PurchasedFeedAquacultureInputSchema
>;
export type PurchasedFeedAquacultureInputTransformed = z.output<
  typeof PurchasedFeedAquacultureInputSchema
>;
