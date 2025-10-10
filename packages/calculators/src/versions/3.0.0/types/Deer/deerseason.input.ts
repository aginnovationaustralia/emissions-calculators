import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const DeerSeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
});

export type DeerSeason = z.infer<typeof DeerSeasonSchema>;
