import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const RiceVegetationSchema = vegetationInput('Rice', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type RiceVegetation = z.infer<typeof RiceVegetationSchema>;
