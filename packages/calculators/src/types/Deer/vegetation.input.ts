import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const DeerVegetationSchema = vegetationInput('Deer', {
  vegetation: VegetationSchema,
  deerProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each deer activity',
  }),
});

export type DeerVegetation = z.infer<typeof DeerVegetationSchema>;
