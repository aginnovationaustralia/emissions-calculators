import { SwineMMSTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { mass, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const OffsiteManureInputSchema = object({
  massAppliedKg: z
    .number()
    .min(0)
    .meta({
      description: 'Mass of organic fertiliser applied, in kg',
    })
    .transform((val) =>
      input('massAppliedKg', mass('Organic Fertiliser', val)),
    ),
  mms: z.enum(SwineMMSTypes).transform((val) => input('mms', val)),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('appliedToSoils', realNumber(val))),
});

export type OffsiteManureInput = z.input<typeof OffsiteManureInputSchema>;
export type OffsiteManureInputTransformed = z.output<
  typeof OffsiteManureInputSchema
>;
