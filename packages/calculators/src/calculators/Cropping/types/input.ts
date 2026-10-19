import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { CroppingCropSchema } from './crop.input';

export const CroppingInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(CroppingCropSchema),
});

export type CroppingInput = z.input<typeof CroppingInputSchema>;
export type CroppingInputTransformed = z.output<typeof CroppingInputSchema>;
