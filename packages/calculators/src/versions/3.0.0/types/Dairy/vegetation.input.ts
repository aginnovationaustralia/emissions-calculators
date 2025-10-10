import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const DairyVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    dairyProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to dairy',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to dairy',
  });

export type DairyVegetation = z.infer<typeof DairyVegetationSchema>;
