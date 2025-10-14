import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const CropVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type CropVegetation = z.infer<typeof CropVegetationSchema>;
