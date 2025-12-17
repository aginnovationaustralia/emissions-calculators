import { z } from 'zod';

export const CottonNetOutputSchema = z
  .object({
    total: z.number(),
    crops: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each crop (in order)' });

export type CottonNetOutput = z.infer<typeof CottonNetOutputSchema>;
