import { z } from 'zod';
import { object, proportion } from './schemas';
import { VegetationSchema } from './vegetation.input';

export const AllocatedVegetationSchema = object({
  vegetation: VegetationSchema,
  allocatedProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to the activity',
  }),
}).meta({
  description:
    'Non-productive vegetation inputs allocated to a particular activity type',
});

export type AllocatedVegetation = z.infer<typeof AllocatedVegetationSchema>;
