import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { DairyHerdInputSchema } from './herd.input';

/**
 * Full dairy enterprise input.
 * Note that a similar type is created for describing dairy manure in DairyManureInputSchema, but it uses a list of cut down herd inputs
 */
export const DairyInputSchema = EnterpriseInputSchema.safeExtend({
  herds: z.array(DairyHerdInputSchema),
});

export type DairyInput = z.input<typeof DairyInputSchema>;
export type DairyInputTransformed = z.output<typeof DairyInputSchema>;
