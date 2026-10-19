import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { HasIsFebruaryInLeapYearInputSchemaForSheep } from '@/calculators/types/has-is-february-in-leap-year.input';
import { z } from 'zod';
import { SheepFlockInputSchema } from './sheep-flock.input';

export const SheepInputSchema = EnterpriseInputSchema.safeExtend({
  flocks: z.array(SheepFlockInputSchema),
  ...HasIsFebruaryInLeapYearInputSchemaForSheep.shape,
});

export type SheepInput = z.input<typeof SheepInputSchema>;
export type SheepInputTransformed = z.output<typeof SheepInputSchema>;
