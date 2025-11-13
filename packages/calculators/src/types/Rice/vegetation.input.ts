import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const RiceVegetationSchema = vegetationInput('Rice', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(proportion()),
});

export type RiceVegetation = z.infer<typeof RiceVegetationSchema>;
