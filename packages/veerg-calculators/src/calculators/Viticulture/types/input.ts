import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { ViticultureCropInputSchema } from './crop.input';

export const ViticultureInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(ViticultureCropInputSchema),
});

export type ViticultureInput = z.input<typeof ViticultureInputSchema>;
export type ViticultureInputTransformed = z.output<
  typeof ViticultureInputSchema
>;
