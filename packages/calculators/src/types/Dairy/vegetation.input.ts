import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const DairyVegetationSchema = vegetationInput('Dairy', {
  vegetation: VegetationSchema,
  dairyProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each dairy activity',
  }),
});

export type DairyVegetation = z.infer<typeof DairyVegetationSchema>;
