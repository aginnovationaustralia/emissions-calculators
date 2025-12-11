import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const GoatSeasonSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEAD }),
});

export type GoatSeason = z.infer<typeof GoatSeasonSchema>;
