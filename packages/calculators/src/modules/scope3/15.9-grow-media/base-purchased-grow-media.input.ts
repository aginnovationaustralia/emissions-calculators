import { input } from '@/tools/inputs';
import { cubicMetresToLitres } from '@/tools/unit-conversion';
import { mass, volume } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BasePurchasedGrowMediaByVolumeInputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input('feed quantity', volume('Grow Media', cubicMetresToLitres(val))),
    )
    .meta({
      description:
        'Quantity of this type of grow media purchased, in cubic metres.',
    }),
});

export const BasePurchasedGrowMediaByMassInputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) => input('feed quantity', mass('Grow Media', val)))
    .meta({
      description:
        'Quantity of this type of mineral supplement purchased, in kilograms.',
    }),
});
