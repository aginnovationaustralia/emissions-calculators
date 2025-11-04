import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const PoultryVegetationSchema = vegetationInput('Poultry', {
  vegetation: VegetationSchema,
  broilersProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to broilers',
  }),
  layersProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to layers',
  }),
});

export type PoultryVegetation = z.infer<typeof PoultryVegetationSchema>;
