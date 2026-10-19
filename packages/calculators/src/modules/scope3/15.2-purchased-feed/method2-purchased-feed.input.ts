import { numberInput } from '@/tools/inputs';
import { PURCH_FEED_15_2 } from '@/tools/modules';
import { massPerMass } from '@/tools/units';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';
export const PurchasedFeedMethod2InputSchema =
  BasePurchasedFeedInputSchema.extend({
    customEmissionsFactor: numberInput(
      (val) => massPerMass('CO2e', 'Purchased Feed', val),
      {
        name: 'custom emissions factor',
        method: '2',
        description: 'Method 2: Emission factor of the type of feed purchased.',
        modules: [PURCH_FEED_15_2],
      },
      (s) => s.min(0),
    ),
  }).meta({ title: 'Method 2 (custom emissions factor)' });

export type PurchasedFeedMethod2Input = z.input<
  typeof PurchasedFeedMethod2InputSchema
>;
export type PurchasedFeedMethod2InputTransformed = z.output<
  typeof PurchasedFeedMethod2InputSchema
>;
