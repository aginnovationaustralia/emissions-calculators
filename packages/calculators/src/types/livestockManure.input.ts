import { z } from 'zod';
import { LivestockManureSeasonSchema } from './livestockManureSeason.input';
import { object } from './schemas';

export const LivestockManureSchema = object({
  spring: LivestockManureSeasonSchema,
  summer: LivestockManureSeasonSchema,
  autumn: LivestockManureSeasonSchema,
  winter: LivestockManureSeasonSchema,
});

export type LivestockManure = z.infer<typeof LivestockManureSchema>;
