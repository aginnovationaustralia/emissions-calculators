import { z } from 'zod';

export const SeasonalCalvingRatesSchema = z
  .object({
    spring: z.number(),
    summer: z.number(),
    autumn: z.number(),
    winter: z.number(),
  })
  .meta({ description: 'Seasonal calving rates, from 0 to 1' });

export type SeasonalCalvingRates = z.infer<typeof SeasonalCalvingRatesSchema>;
