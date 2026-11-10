import { object } from '@/types/schemas';
import z from 'zod';
import { SheepClassesMonthlyInputSchema } from './sheep-classes-monthly.input';
import { SheepClassesSeasonalInputSchema } from './sheep-classes-seasonal.input';

export const SheepClassesInputSchema = z
  .xor([
    object({}).meta({ title: 'Empty object' }),
    z
      .discriminatedUnion('period', [
        SheepClassesSeasonalInputSchema,
        SheepClassesMonthlyInputSchema,
      ])
      .meta({ title: 'Sheep periodic class input' }),
  ])
  .meta({ id: 'SheepClassesInput' });

export type SheepClassesInput = z.input<typeof SheepClassesInputSchema>;
export type SheepClassesInputTransformed = z.output<
  typeof SheepClassesInputSchema
>;
