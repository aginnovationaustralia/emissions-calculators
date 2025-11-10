import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const VineyardVegetationSchema = vegetationInput('Vineyard', {
  vegetation: VegetationSchema,
  allocationToVineyards: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each vineyard activity',
  }),
});

export type VineyardVegetation = z.infer<typeof VineyardVegetationSchema>;
