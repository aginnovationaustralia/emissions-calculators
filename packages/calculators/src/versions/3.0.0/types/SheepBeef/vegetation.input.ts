import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const SheepBeefVegetationSchema = vegetationInput('sheep and beef', {
  vegetation: VegetationSchema,
  beefProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each beef activity',
  }),
  sheepProportion: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each sheep activity',
  }),
});

export type SheepBeefVegetation = z.infer<typeof SheepBeefVegetationSchema>;
