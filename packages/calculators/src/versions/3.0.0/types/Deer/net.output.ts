import { z } from 'zod';

export const DeerNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for deer' });

export type DeerNetOutput = z.infer<typeof DeerNetOutputSchema>;
