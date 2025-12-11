import { z } from 'zod';
import { object } from '../schemas';
import { NitrogenFertiliserSchema } from './fertiliser.input';

export const SeasonalFertiliserSchema = object({
    autumn: NitrogenFertiliserSchema,
    winter: NitrogenFertiliserSchema,
    spring: NitrogenFertiliserSchema,
    summer: NitrogenFertiliserSchema,
  })
  .meta({ description: 'Seasonal nitrogen fertiliser use' });

export type SeasonalFertiliser = z.infer<typeof SeasonalFertiliserSchema>;
