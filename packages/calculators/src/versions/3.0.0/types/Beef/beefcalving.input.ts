import { z } from 'zod';

export const BeefCalvingSchema = z
  .object({
    spring: z.number(),
    summer: z.number(),
    autumn: z.number(),
    winter: z.number(),
  })
  .meta({
    description: 'Fraction of cows calving in each season, between 0 and 1',
  });

export type BeefCalving = z.infer<typeof BeefCalvingSchema>;
