import { z } from 'zod';

export const SeasonalLambingSchema = z
  .object({
    autumn: z.number().min(0),
    winter: z.number().min(0),
    spring: z.number().min(0),
    summer: z.number().min(0),
  })
  .meta({
    description:
      'Seasonal lamb marking rates, i.e. the rate of lambs marked per ewe lambed. Values may exceed 1 if there are more lambs marked than ewes lambed in a season.',
  });

export type SeasonalLambing = z.infer<typeof SeasonalLambingSchema>;
