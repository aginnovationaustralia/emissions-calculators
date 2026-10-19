import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { HorticultureCropInputSchema } from './crop.input';

export const HorticultureInputSchema = EnterpriseInputSchema.safeExtend({
  crops: z.array(HorticultureCropInputSchema),
});

export type HorticultureInput = z.input<typeof HorticultureInputSchema>;
export type HorticultureInputTransformed = z.output<
  typeof HorticultureInputSchema
>;
