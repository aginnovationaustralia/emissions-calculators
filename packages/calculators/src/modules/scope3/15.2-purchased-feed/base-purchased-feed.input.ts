import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BasePurchasedFeedInputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input('feed quantity', mass('Purchased Feed', val * 1000)),
    )
    .meta({
      description: 'Quantity of this type of feed purchased, in tonnes.',
    }),
});
