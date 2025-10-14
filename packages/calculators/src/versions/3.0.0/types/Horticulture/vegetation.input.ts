import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const HorticultureVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()),
});

export type HorticultureVegetation = z.infer<
  typeof HorticultureVegetationSchema
>;
