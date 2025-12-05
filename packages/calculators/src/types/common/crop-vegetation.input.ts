import { z } from 'zod';
import { object, proportion } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const CropVegetationSchema = object({
  vegetation: VegetationSchema,
  allocationToCrops: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each crop activity',
  }),
});

export type CropVegetation = z.infer<typeof CropVegetationSchema>;
