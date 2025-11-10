import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const BuffaloSeasonSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEAD }),
});

export type BuffaloSeason = z.infer<typeof BuffaloSeasonSchema>;
