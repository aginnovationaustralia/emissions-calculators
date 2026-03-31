import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
export const PurchasedFeedMethod2InputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input('feed quantity', mass('Purchased Feed', val * 1000)),
    )
    .meta({}),
  customEmissionsFactor: z
    .number()
    .min(0)
    .transform((val) =>
      input(
        'custom emissions factor',
        massPerMass('CO2e', 'Purchased Feed', val),
      ),
    ),
});

export type PurchasedFeedMethod2Input = z.input<
  typeof PurchasedFeedMethod2InputSchema
>;
export type PurchasedFeedMethod2InputTransformed = z.output<
  typeof PurchasedFeedMethod2InputSchema
>;
