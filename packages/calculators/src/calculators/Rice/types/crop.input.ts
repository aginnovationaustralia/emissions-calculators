import { BaseGrainsCropSchema } from '@/calculators/Grains/types/base-crop.input';
import { singleEnterpriseInput } from '@/types/schemas';

export const RiceCropSchema = singleEnterpriseInput('Rice', {
  ...BaseGrainsCropSchema.shape,
});
