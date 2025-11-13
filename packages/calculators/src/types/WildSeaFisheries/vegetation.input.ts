import { z } from 'zod';
import { proportion, vegetationInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const WildSeaFisheriesVegetationSchema = vegetationInput(
  'WildSeaFisheries',
  {
    vegetation: VegetationSchema,
    allocationToEnterprises: z.array(proportion()).meta({
      description:
        'The proportion of the sequestration that is allocated to each wild sea fisheries enterprise',
    }),
  },
);

export type WildSeaFisheriesVegetation = z.infer<
  typeof WildSeaFisheriesVegetationSchema
>;
