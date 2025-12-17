import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const SheepVegetationSchema = vegetationInput('Sheep', {
  vegetation: VegetationSchema,
  sheepProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each sheep activity',
  }),
});

export type SheepVegetation = z.infer<typeof SheepVegetationSchema>;
