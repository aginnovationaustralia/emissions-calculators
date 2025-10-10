import { z } from 'zod';
import { VineyardVegetationSchema } from './vineyard-vegetation.input';
import { VineyardCropSchema } from './vineyard.input';

export const VineyardInputSchema = z
  .object({
    vineyards: z.array(VineyardCropSchema),
    vegetation: z.array(VineyardVegetationSchema),
  })
  .meta({ description: 'Input data required for the `vineyard` calculator' });

export type VineyardInput = z.infer<typeof VineyardInputSchema>;
