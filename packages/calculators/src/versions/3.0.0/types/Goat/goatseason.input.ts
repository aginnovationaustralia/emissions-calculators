import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const GoatSeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
});

export type GoatSeason = z.infer<typeof GoatSeasonSchema>;
