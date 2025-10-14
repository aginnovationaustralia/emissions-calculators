import { z } from 'zod';
import { VegetationSchema } from './vegetation.input';

export const AllocatedVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    allocatedProportion: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to the activity',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs allocated to a particular activity type',
  });

export type AllocatedVegetation = z.infer<typeof AllocatedVegetationSchema>;
