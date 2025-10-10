import { z } from 'zod';
import { LivestockManureSeasonSchema } from './livestockManureSeason.input';

export const LivestockManureSchema = z.object({
  spring: LivestockManureSeasonSchema,
  summer: LivestockManureSeasonSchema,
  autumn: LivestockManureSeasonSchema,
  winter: LivestockManureSeasonSchema,
});

export type LivestockManure = z.infer<typeof LivestockManureSchema>;
