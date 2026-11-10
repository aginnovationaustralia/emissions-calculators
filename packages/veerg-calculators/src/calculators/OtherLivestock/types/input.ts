import { EnterpriseInputSchema } from '@/calculators/types/enterprise.input';
import { z } from 'zod';
import { OtherLivestockHerdInputSchema } from './herd.input';

export const OtherLivestockInputSchema = EnterpriseInputSchema.safeExtend({
  herds: z.array(OtherLivestockHerdInputSchema),
});

export type OtherLivestockInput = z.input<typeof OtherLivestockInputSchema>;
export type OtherLivestockInputTransformed = z.output<
  typeof OtherLivestockInputSchema
>;
