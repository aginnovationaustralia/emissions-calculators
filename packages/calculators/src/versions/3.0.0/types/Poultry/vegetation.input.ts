import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const PoultryVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    broilersProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to broilers',
    }),
    layersProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to layers',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to broilers and layers',
  });

export type PoultryVegetation = z.infer<typeof PoultryVegetationSchema>;
