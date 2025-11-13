import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const CottonVegetationSchema = vegetationInput('Cotton', {
  vegetation: VegetationSchema,
  allocationToCrops: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each crop activity',
  }),
});

export type CottonVegetation = z.infer<typeof CottonVegetationSchema>;
