import {
  PurchasedFeedAquacultureType,
  PurchasedFeedAquacultureTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PurchasedFeedAquacultureInputSchema = object({
  type: z
    .literal(PurchasedFeedAquacultureTypes)
    .transform((val) =>
      input('purchased feed type', val as PurchasedFeedAquacultureType),
    ),
  amount: z
    .number()
    .min(0)
    .transform((val) => input('feed quantity', mass('Purchased Feed', val))),
});

export type PurchasedFeedAquacultureInput = z.input<
  typeof PurchasedFeedAquacultureInputSchema
>;
export type PurchasedFeedAquacultureInputTransformed = z.output<
  typeof PurchasedFeedAquacultureInputSchema
>;
