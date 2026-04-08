import { input } from '@/tools/inputs';
import { massPerMass } from '@/tools/units';
import { z } from 'zod';
import { BasePurchasedFeedInputSchema } from './base-purchased-feed.input';
export const PurchasedFeedMethod2InputSchema =
  BasePurchasedFeedInputSchema.extend({
    customEmissionsFactor: z
      .number()
      .min(0)
      .transform((val) =>
        input(
          'custom emissions factor',
          massPerMass('CO2e', 'Purchased Feed', val),
        ),
      )
      .meta({
        description:
          'Method 2: Emission factor of the type of feed purchased, in kg CO2e/kg.',
      }),
  });

export type PurchasedFeedMethod2Input = z.input<
  typeof PurchasedFeedMethod2InputSchema
>;
export type PurchasedFeedMethod2InputTransformed = z.output<
  typeof PurchasedFeedMethod2InputSchema
>;
