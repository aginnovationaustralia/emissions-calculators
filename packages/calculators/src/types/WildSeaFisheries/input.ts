import { z } from 'zod';
import { calculatorInput } from '../schemas';
import { WildSeaFisheriesEnterpriseSchema } from './enterprise.input';

export const WildSeaFisheriesInputSchema = calculatorInput('WildSeaFisheries', {
  enterprises: z.array(WildSeaFisheriesEnterpriseSchema),
});

export type WildSeaFisheriesInput = z.infer<typeof WildSeaFisheriesInputSchema>;
