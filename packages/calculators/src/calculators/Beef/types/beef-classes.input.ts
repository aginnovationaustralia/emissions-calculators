import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefBullsLt1MonthlyInputTransformed,
  BeefClassesMonthlyInputSchema,
  BeefCows2To3YearsMonthlyInputTransformed,
  BeefCowsGt3YearsMonthlyInputTransformed,
  BeefCowsLt1MonthlyInputTransformed,
  BeefSpecificClassMonthlyInputTransformed,
  BeefSteersLt1MonthlyInputTransformed,
} from './beef-classes-monthly.input';
import {
  BeefBullsLt1SeasonalInputTransformed,
  BeefClassesSeasonalInputSchema,
  BeefCows2To3YearsSeasonalInputTransformed,
  BeefCowsGt3YearsSeasonalInputTransformed,
  BeefCowsLt1SeasonalInputTransformed,
  BeefSpecificClassSeasonalInputTransformed,
  BeefSteersLt1SeasonalInputTransformed,
} from './beef-classes-seasonal.input';

export const BeefClassesInputSchema = z
  .xor([
    object({}).meta({ title: 'Empty object' }),
    z
      .discriminatedUnion('period', [
        BeefClassesSeasonalInputSchema,
        BeefClassesMonthlyInputSchema,
      ])
      .meta({ title: 'Beef periodic class input' }),
  ])
  .meta({ id: 'BeefClassesInput' });

export type BeefClassesInput = z.input<typeof BeefClassesInputSchema>;
export type BeefClassesInputTransformed = z.output<
  typeof BeefClassesInputSchema
>;

export type BeefSpecificClassInputTransformed =
  | BeefSpecificClassMonthlyInputTransformed
  | BeefSpecificClassSeasonalInputTransformed;

export type BeefSpecificCalfClassInputTransformed =
  | BeefBullsLt1SeasonalInputTransformed
  | BeefBullsLt1MonthlyInputTransformed
  | BeefCowsLt1SeasonalInputTransformed
  | BeefCowsLt1MonthlyInputTransformed
  | BeefSteersLt1SeasonalInputTransformed
  | BeefSteersLt1MonthlyInputTransformed;

export type BeefSpecificClassWithCalvesInputTransformed =
  | BeefCows2To3YearsSeasonalInputTransformed
  | BeefCows2To3YearsMonthlyInputTransformed
  | BeefCowsGt3YearsSeasonalInputTransformed
  | BeefCowsGt3YearsMonthlyInputTransformed;

export const isBeefCalfClass = (
  classInput: BeefSpecificClassInputTransformed,
): classInput is BeefSpecificCalfClassInputTransformed => {
  return (
    classInput.name === 'bullsLt1' ||
    classInput.name === 'cowsLt1' ||
    classInput.name === 'steersLt1'
  );
};
