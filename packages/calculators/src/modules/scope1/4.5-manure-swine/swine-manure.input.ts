import { SwineMMSTypes } from '@/calculators/Grains/constants/enums';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const SwineManureInputSchema = object({
  mms: z.enum(SwineMMSTypes).transform((val) => input('mms', val)),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soil within the activity boundary',
  ).transform((val) => input('appliedToSoils', realNumber(val))),
  // appliedAtStage2: z
  //   .boolean()
  //   .transform((val) => input('appliedAtStage2', val)),
});

export type SwineManureInput = z.input<typeof SwineManureInputSchema>;
export type SwineManureInputTransformed = z.output<
  typeof SwineManureInputSchema
>;
