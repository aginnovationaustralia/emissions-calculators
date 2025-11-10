import { z } from 'zod';

export const VineyardNetOutputSchema = z
  .object({
    total: z.number(),
    vineyards: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each vineyard (in order)' });

export type VineyardNetOutput = z.infer<typeof VineyardNetOutputSchema>;
