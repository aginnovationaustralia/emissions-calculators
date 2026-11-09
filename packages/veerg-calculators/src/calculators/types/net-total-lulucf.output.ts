import { outputTonnesCO2e } from '@/tools/zod';
import { z } from 'zod';
import { EnterpriseNetOutputSchema } from './enterprise-net.output';

export const NetTotalPlusLulucfOutputSchema =
  EnterpriseNetOutputSchema.safeExtend({
    lulucf: outputTonnesCO2e(),
  }).meta({
    description: 'Net emissions for the enterprise with LULUCF as well',
  });

export type NetTotalPlusLulucfOutput = z.infer<
  typeof NetTotalPlusLulucfOutputSchema
>;
