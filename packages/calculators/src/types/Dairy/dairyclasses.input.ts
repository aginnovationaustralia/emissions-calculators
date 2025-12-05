import { z } from 'zod';
import { object } from '../schemas';
import { DairyClassSchema } from './dairyclass.input';

export const DairyClassesSchema = object({
    milkingCows: DairyClassSchema.meta({ description: 'Milking cows' }),
    heifersLt1: DairyClassSchema.meta({
      description: 'Heifers whose age is less than 1 year old',
    }),
    heifersGt1: DairyClassSchema.meta({
      description: 'Heifers whose age is greater than 1 year old',
    }),
    dairyBullsLt1: DairyClassSchema.meta({
      description: 'Dairy bulls whose age is less than 1 year old',
    }),
    dairyBullsGt1: DairyClassSchema.meta({
      description: 'Dairy bulls whose age is greater than 1 year old',
    }),
  })
  .meta({ description: 'Dairy classes of different types and age ranges' });

export type DairyClasses = z.infer<typeof DairyClassesSchema>;
