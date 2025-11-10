import { z } from 'zod';

export const HorticultureNetOutputSchema = z
  .object({
    total: z.number(),
    crops: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each crop (in order)' });

export type HorticultureNetOutput = z.infer<typeof HorticultureNetOutputSchema>;
