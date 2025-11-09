import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const SeasonalCalvingRatesSchema = SeasonalProportionsSchema(
  'Seasonal calving rates, from 0 to 1',
);

export type SeasonalCalvingRates = z.infer<typeof SeasonalCalvingRatesSchema>;
