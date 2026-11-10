import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import z from 'zod';
import { PigsHerdInputSchema } from './pigs-herd.input';

export const PigsInputSchema = EnterpriseInputSchema.safeExtend({
  herds: z.array(PigsHerdInputSchema),
});

export type PigsInput = z.input<typeof PigsInputSchema>;
export type PigsInputTransformed = z.output<typeof PigsInputSchema>;
