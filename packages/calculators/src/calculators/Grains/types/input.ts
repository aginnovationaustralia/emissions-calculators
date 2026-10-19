import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { GrainsCropInputSchema } from './crop.input';

export const GrainsInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(GrainsCropInputSchema),
});

export type GrainsInput = z.input<typeof GrainsInputSchema>;
export type GrainsInputTransformed = z.output<typeof GrainsInputSchema>;
