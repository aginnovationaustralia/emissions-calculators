import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const BuffaloSeasonSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEAD }),
});

export type BuffaloSeason = z.infer<typeof BuffaloSeasonSchema>;
