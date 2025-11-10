import { z } from 'zod';
import { vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const WildSeaFisheriesVegetationSchema = vegetationInput(
  'WildSeaFisheries',
  {
    vegetation: VegetationSchema,
    allocationToEnterprises: z.array(z.number()).meta({
      description:
        'The proportion of the sequestration that is allocated to each wild sea fisheries enterprise',
    }),
  },
);

export type WildSeaFisheriesVegetation = z.infer<
  typeof WildSeaFisheriesVegetationSchema
>;
