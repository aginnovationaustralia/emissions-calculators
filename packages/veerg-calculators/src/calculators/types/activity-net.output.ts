import { outputTonnesCO2e } from '@/tools/zod';
import { z } from 'zod';

export const ActivityNetOutputSchema = z
  .object({
    total: outputTonnesCO2e(),
  })
  .meta({ description: 'Net emissions for the activity' });

export type ActivityNetOutput = z.infer<typeof ActivityNetOutputSchema>;
