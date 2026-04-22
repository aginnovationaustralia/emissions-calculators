import { BaseGrainsCropSchema } from '@/calculators/Grains/types/base-crop.input';
import { RiceCultivationInputSchema } from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
import { singleEnterpriseInput } from '@/types/schemas';
import z from 'zod';

export const RiceCropSchema = singleEnterpriseInput('Rice', {
  ...BaseGrainsCropSchema.shape,
  ...RiceCultivationInputSchema.shape,
});

export type RiceCrop = z.input<typeof RiceCropSchema>;
export type RiceCropTransformed = z.output<typeof RiceCropSchema>;
