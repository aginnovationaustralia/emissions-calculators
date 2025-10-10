import { z } from 'zod';

export const GrainsNetOutputSchema = z
  .object({
    total: z.number(),
    crops: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each crop (in order)' });

export type GrainsNetOutput = z.infer<typeof GrainsNetOutputSchema>;
