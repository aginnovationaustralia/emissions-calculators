import { z } from 'zod';
import { object } from '../schemas';
import { DairySeasonSchema } from './dairyseason.input';

export const DairyClassSchema = object({
  autumn: DairySeasonSchema,
  winter: DairySeasonSchema,
  spring: DairySeasonSchema,
  summer: DairySeasonSchema,
}).meta({ description: 'Dairy class with seasonal data' });

export type DairyClass = z.infer<typeof DairyClassSchema>;
