import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { HasIsFebruaryInLeapYearInputSchemaForBeef } from '@/calculators/types/has-is-february-in-leap-year.input';
import { LULUCFParentInputSchema } from '@/modules/lulucf/input';
import { z } from 'zod';
import { BeefHerdInputSchema } from './beef-herd.input';

export const BeefInputSchema = EnterpriseInputSchema.safeExtend(
  LULUCFParentInputSchema.safeExtend({
    herds: z.array(BeefHerdInputSchema),
    ...HasIsFebruaryInLeapYearInputSchemaForBeef.shape,
  }).shape,
);

export type BeefInput = z.input<typeof BeefInputSchema>;
export type BeefInputTransformed = z.output<typeof BeefInputSchema>;
