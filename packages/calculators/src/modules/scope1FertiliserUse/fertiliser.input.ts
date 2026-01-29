import { input } from '@/tools/inputs';
import { massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import Decimal from 'decimal.js-light';
import { z } from 'zod';

export const FertiliserInputSchema = object({
  ureaApplication: z
    .number()
    .min(0)
    .transform((val) =>
      input('ureaApplication', massPerArea('Urea', new Decimal(val))),
    )
    .meta({
      description:
        'Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare)',
    }),
});

export type FertiliserInput = z.input<typeof FertiliserInputSchema>;
export type FertiliserInputTransformed = z.output<typeof FertiliserInputSchema>;
