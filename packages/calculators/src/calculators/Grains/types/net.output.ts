import { outputValue } from '@/tools/zod';
import { z } from 'zod';

export const NetOutputSchema = z
  .object({
    total: outputValue(),
  })
  .meta({ description: 'Net emissions for the activity' });

export type NetOutput = z.infer<typeof NetOutputSchema>;
