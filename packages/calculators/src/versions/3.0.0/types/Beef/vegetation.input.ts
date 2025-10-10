import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const BeefVegetationSchema = z
  .object({
    vegetation: VegetationSchema,
    beefProportion: z.number().optional().meta({
      description: `The proportion of the sequestration that is allocated to beef. Deprecated note: Please use \`allocationToBeef\` instead.`,
    }),
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
