import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const SheepBeefVegetationSchema = vegetationInput('sheep and beef', {
  vegetation: VegetationSchema,
  beefProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each beef activity',
  }),
  sheepProportion: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each sheep activity',
  }),
});

export type SheepBeefVegetation = z.infer<typeof SheepBeefVegetationSchema>;
