import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const SugarVegetationSchema = vegetationInput('Sugar', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each sugar activity',
  }),
});

export type SugarVegetation = z.infer<typeof SugarVegetationSchema>;
