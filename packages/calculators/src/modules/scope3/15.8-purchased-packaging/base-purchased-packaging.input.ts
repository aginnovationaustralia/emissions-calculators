import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BasePurchasedPackagingInputSchema = object({
  amount: z
    .number()
    .min(0)
    .transform((val) =>
      input('Quantity of packaging units purchased', realNumber(val)),
    )
    .meta({
      description: 'Quantity of packaging units purchased.',
    }),
});
