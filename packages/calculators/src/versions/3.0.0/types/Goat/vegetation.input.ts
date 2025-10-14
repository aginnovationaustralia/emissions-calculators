import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const GoatVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    goatProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to goat',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to goat',
  });

export type GoatVegetation = z.infer<typeof GoatVegetationSchema>;
