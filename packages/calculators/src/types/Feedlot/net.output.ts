import { z } from 'zod';

export const FeedlotNetOutputSchema = z
  .object({
    total: z.number(),
  })
  .meta({ description: 'Net emissions for feedlot' });

export type FeedlotNetOutput = z.infer<typeof FeedlotNetOutputSchema>;
