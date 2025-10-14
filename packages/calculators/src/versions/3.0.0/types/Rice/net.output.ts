import { z } from 'zod';

export const RiceNetOutputSchema = z
  .object({
    total: z.number(),
    crops: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each crop (in order)' });

export type RiceNetOutput = z.infer<typeof RiceNetOutputSchema>;
