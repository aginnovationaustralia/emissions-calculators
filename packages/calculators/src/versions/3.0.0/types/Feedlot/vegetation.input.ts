import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const FeedlotVegetationSchema = vegetationInput('Feedlot', {
  vegetation: VegetationSchema,
  feedlotProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each feedlot activity',
  }),
});

export type FeedlotVegetation = z.infer<typeof FeedlotVegetationSchema>;
