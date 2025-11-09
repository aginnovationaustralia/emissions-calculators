import { z } from 'zod';

export const SugarNetOutputSchema = z
  .object({
    total: z.number(),
    crops: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each crop (in order)' });

export type SugarNetOutput = z.infer<typeof SugarNetOutputSchema>;
