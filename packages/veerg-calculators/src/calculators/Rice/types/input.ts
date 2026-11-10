import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { RiceCropInputSchema } from './crop.input';

export const RiceInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(RiceCropInputSchema),
});

export type RiceInput = z.input<typeof RiceInputSchema>;
export type RiceInputTransformed = z.output<typeof RiceInputSchema>;
