import { z } from 'zod';

export const PorkNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for pork' });

export type PorkNetOutput = z.infer<typeof PorkNetOutputSchema>;
