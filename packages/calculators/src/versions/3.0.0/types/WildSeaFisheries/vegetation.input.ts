import { z } from 'zod';
import { VegetationSchema } from '../vegetation.input';

export const WildSeaFisheriesVegetationSchema = z.object({
  vegetation: VegetationSchema,
  allocationToEnterprises: z.array(z.number()),
});

export type WildSeaFisheriesVegetation = z.infer<
  typeof WildSeaFisheriesVegetationSchema
>;
