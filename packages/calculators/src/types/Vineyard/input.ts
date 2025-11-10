import { z } from 'zod';
import { calculatorInput } from '../schemas';
import { VineyardVegetationSchema } from './vineyard-vegetation.input';
import { VineyardCropSchema } from './vineyard.input';

export const VineyardInputSchema = calculatorInput('Vineyard', {
  vineyards: z.array(VineyardCropSchema),
  vegetation: z.array(VineyardVegetationSchema),
});

export type VineyardInput = z.infer<typeof VineyardInputSchema>;
