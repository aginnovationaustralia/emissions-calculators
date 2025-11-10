import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const CottonVegetationSchema = vegetationInput('Cotton', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each crop activity',
  }),
});

export type CottonVegetation = z.infer<typeof CottonVegetationSchema>;
