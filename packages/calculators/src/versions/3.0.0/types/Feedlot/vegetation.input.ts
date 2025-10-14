import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const FeedlotVegetationSchema = z.object({
  vegetation: VegetationSchema,
  feedlotProportion: z.array(z.number()),
});

export type FeedlotVegetation = z.infer<typeof FeedlotVegetationSchema>;
