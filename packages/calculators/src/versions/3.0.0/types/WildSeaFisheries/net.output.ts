import { z } from 'zod';

export const WildSeaFisheriesNetOutputSchema = z
  .object({
    total: z.number(),
    enterprises: z.array(z.number()),
  })
  .meta({ description: 'Net emissions for each enterprise (in order)' });

export type WildSeaFisheriesNetOutput = z.infer<
  typeof WildSeaFisheriesNetOutputSchema
>;
