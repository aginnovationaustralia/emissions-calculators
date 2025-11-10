import { z } from 'zod';
import { DairySeasonSchema } from './dairyseason.input';

export const DairyClassSchema = z
  .object({
    autumn: DairySeasonSchema,
    winter: DairySeasonSchema,
    spring: DairySeasonSchema,
    summer: DairySeasonSchema,
  })
  .meta({ description: 'Dairy class with seasonal data' });

export type DairyClass = z.infer<typeof DairyClassSchema>;
