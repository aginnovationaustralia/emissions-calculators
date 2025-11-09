import { z } from 'zod';
import { deprecated, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const BeefVegetationSchema = vegetationInput('Beef', {
  vegetation: VegetationSchema,
  beefProportion: z
    .number()
    .optional()
    .meta(
      deprecated(
        `The proportion of the sequestration that is allocated to beef`,
        `Please use \`allocationToBeef\` instead`,
      ),
    ),
  allocationToBeef: z.array(z.number()).meta({
    description:
      'The proportion of the sequestration that is allocated to each beef activity',
  }),
});

export type BeefVegetation = z.infer<typeof BeefVegetationSchema>;
