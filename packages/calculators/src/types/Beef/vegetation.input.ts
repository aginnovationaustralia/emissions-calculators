import { z } from 'zod';
import { deprecated, proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const BeefVegetationSchema = vegetationInput('Beef', {
  vegetation: VegetationSchema,
  beefProportion: z
    .number()
    .min(0)
    .optional()
    .meta(
      deprecated(
        `The proportion of the sequestration that is allocated to beef`,
        `Please use \`allocationToBeef\` instead`,
      ),
    ),
  allocationToBeef: z.array(proportion()).meta({
    description:
      'The proportion of the sequestration that is allocated to each beef activity',
  }),
});

export type BeefVegetation = z.infer<typeof BeefVegetationSchema>;
