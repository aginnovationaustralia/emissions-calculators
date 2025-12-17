import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const SheepNetSchema = z.object({
  total: z.number().meta({ description: OUTPUTDESCRIPTIONS.netEmissionsTotal }),
  sheep: z
    .number()
    .meta({ description: 'Net emissions of sheep, in tonnes-CO2e/year' }),
});

export type SheepNet = z.infer<typeof SheepNetSchema>;
