import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const BuffaloVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    buffaloProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to Buffalo',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to Buffalo',
  });

export type BuffaloVegetation = z.infer<typeof BuffaloVegetationSchema>;
