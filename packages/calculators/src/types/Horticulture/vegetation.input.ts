import { z } from 'zod';
import { proportion, singleEnterpriseInput } from '../schemas';
import { VegetationSchema } from '../vegetation.input';

export const HorticultureVegetationSchema = singleEnterpriseInput(
  'Horticulture',
  {
    vegetation: VegetationSchema,
    allocationToCrops: z.array(proportion()),
  },
);

export type HorticultureVegetation = z.infer<
  typeof HorticultureVegetationSchema
>;
