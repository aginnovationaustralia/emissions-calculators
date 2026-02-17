import { number, z } from 'zod';

export const NetOutputSchema = z
  .object({
    total: number(),
  })
  .meta({ description: 'Net emissions for the activity' });

export type NetOutput = z.infer<typeof NetOutputSchema>;
