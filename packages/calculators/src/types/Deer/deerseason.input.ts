import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const DeerSeasonSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEAD }),
});

export type DeerSeason = z.infer<typeof DeerSeasonSchema>;
