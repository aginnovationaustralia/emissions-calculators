import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const SugarVegetationSchema = vegetationInput('Sugar', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each sugar activity',
  }),
});

export type SugarVegetation = z.infer<typeof SugarVegetationSchema>;
