import { z } from 'zod';
import { WildSeaFisheriesEnterpriseSchema } from './enterprise.input';

export const WildSeaFisheriesInputSchema = z
  .object({
    enterprises: z.array(WildSeaFisheriesEnterpriseSchema),
  })
  .meta({
    description: 'Input data required for the `wildseafisheries` calculator',
  });

export type WildSeaFisheriesInput = z.infer<typeof WildSeaFisheriesInputSchema>;
