import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const CowsCalvingProportionSchema = SeasonalProportionsSchema(
  'Proportion of cows calving in each season, from 0 to 1',
);

export type CowsCalvingProportion = z.infer<typeof CowsCalvingProportionSchema>;
