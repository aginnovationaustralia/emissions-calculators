import { booleanInput } from '@/tools/inputs';
import {
  ENTERIC_BEEF_3_2,
  ENTERIC_SHEEP_3_4,
  MANURE_BEEF_4_2,
  MANURE_SHEEP_4_4,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const hasIsFebruaryInLeapYearInputSchema = (
  location: 'beef' | 'sheep',
) =>
  object({
    isFebruaryInLeapYear: booleanInput(
      'isFebruaryInLeapYear',
      'For the 12 month period covered by the calculation, is the month of February within a leap year?',
      location === 'beef'
        ? [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2]
        : [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
    ),
  });
export type HasIsFebruaryInLeapYearInput = z.input<
  ReturnType<typeof hasIsFebruaryInLeapYearInputSchema>
>;
export type HasIsFebruaryInLeapYearInputTransformed = z.output<
  ReturnType<typeof hasIsFebruaryInLeapYearInputSchema>
>;

export const HasIsFebruaryInLeapYearInputSchemaForSheep =
  hasIsFebruaryInLeapYearInputSchema('sheep');
export const HasIsFebruaryInLeapYearInputSchemaForBeef =
  hasIsFebruaryInLeapYearInputSchema('beef');
