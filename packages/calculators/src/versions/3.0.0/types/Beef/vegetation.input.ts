import { z } from 'zod';
import { deprecated } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const BeefVegetationSchema = z
  .object({
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
        'The proportion of the sequestration that is allocated to each beef',
    }),
  })
  .meta({
    description:
      'Non-productive vegetation inputs along with allocations to beef',
  });

export type BeefVegetation = z.infer<typeof BeefVegetationSchema>;
