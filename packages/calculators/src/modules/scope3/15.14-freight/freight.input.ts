import { FreightTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { kilometresToMetres, tonnesToKg } from '@/tools/unit-conversion';
import { distance, mass } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const FreightInputSchema = object({
  freightType: z
    .literal(FreightTypes)
    .transform((val) => input('freightType', val))
    .meta({
      description: 'The type of vehicle used to transport this freight.',
    }),
  distance: z
    .number()
    .min(0)
    .transform((val) =>
      input('total distance', distance(kilometresToMetres(val))),
    )
    .meta({
      description: 'Distance the freight travelled, in kilometres.',
    }),
  weight: z
    .number()
    .min(0)
    .transform((val) =>
      input('total weight transported', mass('Freight Goods', tonnesToKg(val))),
    )
    .meta({
      description: 'Total weight transported, in tonnes',
    }),
});

export type FreightInput = z.input<typeof FreightInputSchema>;
export type FreightInputTransformed = z.output<typeof FreightInputSchema>;
