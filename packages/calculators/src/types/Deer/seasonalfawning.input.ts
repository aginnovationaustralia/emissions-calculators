import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const SeasonalFawningRatesSchema = SeasonalProportionsSchema(
  'Seasonal fawning rates, from 0 to 1',
);

export type SeasonalFawningRates = z.infer<typeof SeasonalFawningRatesSchema>;
