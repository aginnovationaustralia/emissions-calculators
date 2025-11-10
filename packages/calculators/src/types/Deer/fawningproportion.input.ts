import { z } from 'zod';
import { SeasonalProportionsSchema } from '../schemas';

export const DoesFawningProportionSchema = SeasonalProportionsSchema(
  'Proportion of does fawning in each season, from 0 to 1',
);

export type DoesFawningProportion = z.infer<typeof DoesFawningProportionSchema>;
