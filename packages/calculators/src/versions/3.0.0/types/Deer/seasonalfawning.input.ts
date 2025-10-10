import { z } from 'zod';

export const SeasonalFawningRatesSchema = z
  .object({
    spring: z.number(),
    summer: z.number(),
    autumn: z.number(),
    winter: z.number(),
  })
  .meta({ description: 'Seasonal fawning rates, from 0 to 1' });

export type SeasonalFawningRates = z.infer<typeof SeasonalFawningRatesSchema>;
