import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const CottonVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type CottonVegetation = z.infer<typeof CottonVegetationSchema>;
