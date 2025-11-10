import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const DeerVegetationSchema = vegetationInput('Deer', {
  vegetation: VegetationSchema,
  deerProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each deer activity',
  }),
});

export type DeerVegetation = z.infer<typeof DeerVegetationSchema>;
