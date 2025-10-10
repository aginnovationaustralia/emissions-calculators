import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const RiceVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type RiceVegetation = z.infer<typeof RiceVegetationSchema>;
