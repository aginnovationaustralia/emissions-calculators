import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const EwesLambingSchema = SeasonalProportionsSchema(
  'The proportion of ewes lambing in each season, as a value from 0 to 1',
);

export type EwesLambing = z.infer<typeof EwesLambingSchema>;
