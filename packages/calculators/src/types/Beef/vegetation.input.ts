import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const BeefVegetationSchema = vegetationInput('Beef', {
  vegetation: VegetationSchema,
  allocationToBeef: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each beef activity',
  }),
});

export type BeefVegetation = z.infer<typeof BeefVegetationSchema>;
