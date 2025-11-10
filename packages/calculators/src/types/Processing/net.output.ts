import { z } from 'zod';

export const ProcessingNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for the processing activity' });

export type ProcessingNetOutput = z.infer<typeof ProcessingNetOutputSchema>;
