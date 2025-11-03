import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const BuffaloVegetationSchema = vegetationInput('Buffalo', {
  vegetation: VegetationSchema,
  buffaloProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each Buffalo activity',
  }),
});

export type BuffaloVegetation = z.infer<typeof BuffaloVegetationSchema>;
