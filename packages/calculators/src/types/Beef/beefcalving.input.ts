import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const BeefCalvingSchema = SeasonalProportionsSchema(
  'Fraction of cows calving in each season, between 0 and 1',
);

export type BeefCalving = z.infer<typeof BeefCalvingSchema>;
