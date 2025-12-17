import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const PoultryNetSchema = z.object({
  total: z.number().meta({ description: OUTPUTDESCRIPTIONS.netEmissionsTotal }),
  broilers: z
    .number()
    .meta({ description: 'Net emissions of broilers, in tonnes-CO2e/year' }),
  layers: z
    .number()
    .meta({ description: 'Net emissions of layers, in tonnes-CO2e/year' }),
});

export type PoultryNet = z.infer<typeof PoultryNetSchema>;
