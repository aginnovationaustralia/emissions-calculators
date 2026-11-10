import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { CottonCropInputSchema } from './crop.input';

export const CottonInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(CottonCropInputSchema),
});

export type CottonInput = z.input<typeof CottonInputSchema>;
export type CottonInputTransformed = z.output<typeof CottonInputSchema>;
