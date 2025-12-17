import { z } from 'zod';

export const BuffaloNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for Buffalo' });

export type BuffaloNetOutput = z.infer<typeof BuffaloNetOutputSchema>;
