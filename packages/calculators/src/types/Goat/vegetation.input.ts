import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const GoatVegetationSchema = vegetationInput('Goat', {
  vegetation: VegetationSchema,
  goatProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to goat',
  }),
});

export type GoatVegetation = z.infer<typeof GoatVegetationSchema>;
