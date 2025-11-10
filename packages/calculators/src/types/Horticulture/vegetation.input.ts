import { z } from 'zod';
import { singleEnterpriseInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const HorticultureVegetationSchema = singleEnterpriseInput(
  'Horticulture',
  {
    vegetation: VegetationSchema,
    allocationToCrops: z.array(z.number()),
  },
);

export type HorticultureVegetation = z.infer<
  typeof HorticultureVegetationSchema
>;
