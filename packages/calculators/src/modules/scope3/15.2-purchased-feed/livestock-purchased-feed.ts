import {
  PurchasedFeedLivestockType,
  PurchasedFeedLivestockTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const PurchasedFeedLivestockInputSchema = object({
  type: z
    .literal(PurchasedFeedLivestockTypes)
    .transform((val) =>
      input('purchased feed type', val as PurchasedFeedLivestockType),
    ),
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input('feed quantity', mass('Purchased Feed', val * 1000)),
    ),
});

export type PurchasedFeedLivestockInput = z.input<
  typeof PurchasedFeedLivestockInputSchema
>;
export type PurchasedFeedLivestockInputTransformed = z.output<
  typeof PurchasedFeedLivestockInputSchema
>;
