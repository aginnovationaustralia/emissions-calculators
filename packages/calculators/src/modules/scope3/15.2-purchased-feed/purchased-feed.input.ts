import { PurchasedFeedType, PurchasedFeedTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass, massPerMass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PurchasedFeedInputSchema = object({
  type: z
    .literal(PurchasedFeedTypes)
    .transform((val) => input('purchased feed type', val as PurchasedFeedType)),
  amount: z
    .number()
    .min(0)
    // TODO: Check what this string should be
    .transform((val) => input('feed quantity', mass('Purchased Feed', val))),
  customEmissionsFactor: z
    .number()
    .min(0)
    .optional()
    .transform((val) =>
      val
        ? input('lpg', massPerMass('CO2e', 'Purchased Feed', val))
        : undefined,
    ),
});

export type PurchasedFeedInput = z.input<typeof PurchasedFeedInputSchema>;
export type PurchasedFeedInputTransformed = z.output<
  typeof PurchasedFeedInputSchema
>;
