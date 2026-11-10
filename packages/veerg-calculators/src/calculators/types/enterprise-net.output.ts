import { outputTonnesCO2e } from '@/tools/zod';
import { z } from 'zod';

export const EnterpriseNetOutputSchema = z
  .object({
    total: outputTonnesCO2e(),
  })
  .meta({ description: 'Net emissions for the enterprise' });

export type EnterpriseNetOutput = z.infer<typeof EnterpriseNetOutputSchema>;
