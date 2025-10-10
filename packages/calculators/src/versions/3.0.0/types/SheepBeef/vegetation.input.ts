import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const SheepBeefVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    beefProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to beef',
    }),
    sheepProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to sheep',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to sheep and beef',
  });

export type SheepBeefVegetation = z.infer<typeof SheepBeefVegetationSchema>;
