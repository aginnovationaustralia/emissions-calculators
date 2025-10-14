import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const VineyardVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToVineyards: z.array(z.number()),
});

export type VineyardVegetation = z.infer<typeof VineyardVegetationSchema>;
