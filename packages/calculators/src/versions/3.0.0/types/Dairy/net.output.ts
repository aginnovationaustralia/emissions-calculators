import { z } from 'zod';
import { OUTPUTDESCRIPTIONS } from '../descriptions.schema';

export const DairyNetSchema = z.object({
  total: z.number().meta({ description: OUTPUTDESCRIPTIONS.netEmissionsTotal }),
});

export type DairyNet = z.infer<typeof DairyNetSchema>;
