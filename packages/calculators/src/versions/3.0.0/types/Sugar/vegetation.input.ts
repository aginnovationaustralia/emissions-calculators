import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const SugarVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type SugarVegetation = z.infer<typeof SugarVegetationSchema>;
