import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const BeefNetSchema = z.object({
  total: z.number().meta({ description: OUTPUTDESCRIPTIONS.netEmissionsTotal }),
  beef: z
    .number()
    .meta({ description: 'Net emissions of beef, in tonnes-CO2e/year' }),
});

export type BeefNet = z.infer<typeof BeefNetSchema>;
