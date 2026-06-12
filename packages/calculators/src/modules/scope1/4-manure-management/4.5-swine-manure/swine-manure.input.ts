import { BaseSwineInputSchema } from '@/calculators/Swine/types/input';
import { input } from '@/tools/inputs';
import { realNumber } from '@/tools/units';
import { proportion } from '@/types/schemas';
import z from 'zod';

export const SwineManureInputSchema = BaseSwineInputSchema.extend({
  type: z.literal(['swine']),
  fractionAppliedToSoils: proportion(
    'Fraction of manure applied to soils within the farm boundary',
  ).transform((v) => input('PF', realNumber(v))),
});

export type SwineManureInput = z.input<typeof SwineManureInputSchema>;
export type SwineManureInputTransformed = z.output<
  typeof SwineManureInputSchema
>;
