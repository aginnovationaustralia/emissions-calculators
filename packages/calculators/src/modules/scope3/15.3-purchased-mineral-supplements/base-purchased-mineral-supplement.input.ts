import { input } from '@/tools/inputs';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BasePurchasedMineralSupplementInputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input(
        'feed quantity',
        mass('Purchased Mineral Supplement', tonnesToKg(val)),
      ),
    )
    .meta({
      description:
        'Quantity of this type of mineral supplement purchased, in tonnes.',
    }),
});
