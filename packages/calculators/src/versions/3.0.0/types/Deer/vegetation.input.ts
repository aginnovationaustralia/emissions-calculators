import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const DeerVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    deerProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to deer',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to deer',
  });

export type DeerVegetation = z.infer<typeof DeerVegetationSchema>;
