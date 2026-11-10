import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { SugarCropInputSchema } from './crop.input';

export const SugarInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(SugarCropInputSchema),
});

export type SugarInput = z.input<typeof SugarInputSchema>;
export type SugarInputTransformed = z.output<typeof SugarInputSchema>;
