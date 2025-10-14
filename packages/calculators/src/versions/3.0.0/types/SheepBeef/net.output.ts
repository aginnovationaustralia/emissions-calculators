import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const SheepBeefNetSchema = z.object({
  total: z.number().meta({ description: OUTPUTDESCRIPTIONS.netEmissionsTotal }),
  beef: z
    .number()
    .meta({ description: 'Net emissions of beef, in tonnes-CO2e/year' }),
  sheep: z
    .number()
    .meta({ description: 'Net emissions of sheep, in tonnes-CO2e/year' }),
});

export type SheepBeefNet = z.infer<typeof SheepBeefNetSchema>;
