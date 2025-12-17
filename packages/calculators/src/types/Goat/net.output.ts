import { z } from 'zod';

export const GoatNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for goat' });

export type GoatNetOutput = z.infer<typeof GoatNetOutputSchema>;
