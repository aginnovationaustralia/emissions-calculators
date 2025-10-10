import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const SheepVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    sheepProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to sheep',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to sheep',
  });

export type SheepVegetation = z.infer<typeof SheepVegetationSchema>;
