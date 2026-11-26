import { Months } from '@/constants/enums';
import {
  getMonthsForSeasonAfterCalving,
  getMonthsForSeasonOfCalving,
} from '@/modules/scope1/shared/beef/calving-seasons';
import { enumInput } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import { checkHerdCalving } from './beef-calving-validation';
import {
  BeefCalfClassMonthlyInputSchema,
  BeefClassMonthlyInputSchema,
  BeefClassWithCalvesMonthlyInputSchema,
} from './beef-class.input';

const BeefBullsLt1MonthlyInputSchema =
  BeefCalfClassMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'bullsLt1' as const,
    number: '1' as const,
  }));

const BeefBullsGt1MonthlyInputSchema = BeefClassMonthlyInputSchema.transform(
  (val) => ({
    ...val,
    name: 'bullsGt1' as const,
    number: '2' as const,
  }),
);

const BeefCowsLt1MonthlyInputSchema = BeefCalfClassMonthlyInputSchema.transform(
  (val) => ({
    ...val,
    name: 'cowsLt1' as const,
    number: '3' as const,
  }),
);

const BeefCows1To2YearsMonthlyInputSchema =
  BeefClassWithCalvesMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'cows1To2Years' as const,
    number: '4' as const,
  }));

const BeefCows2To3YearsMonthlyInputSchema =
  BeefClassWithCalvesMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'cows2To3Years' as const,
    number: '5a' as const,
  }));

const BeefCowsGt3YearsMonthlyInputSchema =
  BeefClassWithCalvesMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'cowsGt3Years' as const,
    number: '5b' as const,
  }));

const BeefSteersLt1MonthlyInputSchema =
  BeefCalfClassMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'steersLt1' as const,
    number: '6' as const,
  }));

const BeefSteers1To2YearsMonthlyInputSchema =
  BeefClassMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'steers1To2Years' as const,
    number: '7a' as const,
  }));

const BeefSteers2To3YearsMonthlyInputSchema =
  BeefClassMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'steers2To3Years' as const,
    number: '7b' as const,
  }));

const BeefSteersGt3YearsMonthlyInputSchema =
  BeefClassMonthlyInputSchema.transform((val) => ({
    ...val,
    name: 'steersGt3Years' as const,
    number: '7c' as const,
  }));

export const BeefClassesMonthlyInputSchema = object({
  period: z.literal('monthly'),
  calvingSeasonStartMonths: z
    .array(
      enumInput(Months, {
        name: 'Calving start month',
        method: '2',
        description: 'A month in which a calving season starts.',
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      }),
    )
    .meta({
      description:
        "The months in which the herd's calving seasons start. Each calving season is the 3 months from its start month, and the season after calving is the 3 months after that (Chapter 3, 3.2.2.1, Method 2 herd flow). When seasons overlap, a month belongs to the season with the nearest start. LCjk=4,5 for each month of a calving season is the class's fractionCowsCalving summed over the season, the same total applies to each month of the season after calving, and it is 0 in all other months. The calves' shares are worked out the same way from calvesBorn. Give an empty list for a herd that does not calve.",
    }),
  bullsLt1: BeefBullsLt1MonthlyInputSchema.optional(),
  bullsGt1: BeefBullsGt1MonthlyInputSchema.optional(),
  cowsLt1: BeefCowsLt1MonthlyInputSchema.optional(),
  cows1To2Years: BeefCows1To2YearsMonthlyInputSchema.optional(),
  cows2To3Years: BeefCows2To3YearsMonthlyInputSchema.optional(),
  cowsGt3Years: BeefCowsGt3YearsMonthlyInputSchema.optional(),
  steersLt1: BeefSteersLt1MonthlyInputSchema.optional(),
  steers1To2Years: BeefSteers1To2YearsMonthlyInputSchema.optional(),
  steers2To3Years: BeefSteers2To3YearsMonthlyInputSchema.optional(),
  steersGt3Years: BeefSteersGt3YearsMonthlyInputSchema.optional(),
})
  .superRefine((classes, ctx) =>
    checkHerdCalving(ctx, {
      classes,
      periods: Months,
      calvingSeasonsKey: 'calvingSeasonStartMonths',
      calvingSeasons: classes.calvingSeasonStartMonths.map((m) => m.unit),
      getSeasonOfCalving: getMonthsForSeasonOfCalving,
      getSeasonAfterCalving: getMonthsForSeasonAfterCalving,
      howToCover: (month) =>
        `Add a month to calvingSeasonStartMonths that starts a calving season covering ${month} (${month} or one of the 2 months before it)`,
    }),
  )
  .meta({
    title: 'Beef classes with monthly input',
  });

export type BeefClassesMonthlyInput = z.input<
  typeof BeefClassesMonthlyInputSchema
>;

export type BeefBullsLt1MonthlyInputTransformed = z.output<
  typeof BeefBullsLt1MonthlyInputSchema
>;
export type BeefBullsGt1MonthlyInputTransformed = z.output<
  typeof BeefBullsGt1MonthlyInputSchema
>;
export type BeefCowsLt1MonthlyInputTransformed = z.output<
  typeof BeefCowsLt1MonthlyInputSchema
>;
export type BeefCows1To2YearsMonthlyInputTransformed = z.output<
  typeof BeefCows1To2YearsMonthlyInputSchema
>;
export type BeefCows2To3YearsMonthlyInputTransformed = z.output<
  typeof BeefCows2To3YearsMonthlyInputSchema
>;
export type BeefCowsGt3YearsMonthlyInputTransformed = z.output<
  typeof BeefCowsGt3YearsMonthlyInputSchema
>;
export type BeefSteersLt1MonthlyInputTransformed = z.output<
  typeof BeefSteersLt1MonthlyInputSchema
>;
export type BeefSteers1To2YearsMonthlyInputTransformed = z.output<
  typeof BeefSteers1To2YearsMonthlyInputSchema
>;
export type BeefSteers2To3YearsMonthlyInputTransformed = z.output<
  typeof BeefSteers2To3YearsMonthlyInputSchema
>;
export type BeefSteersGt3YearsMonthlyInputTransformed = z.output<
  typeof BeefSteersGt3YearsMonthlyInputSchema
>;

export type BeefSpecificClassMonthlyInputTransformed =
  | BeefBullsLt1MonthlyInputTransformed
  | BeefBullsGt1MonthlyInputTransformed
  | BeefCowsLt1MonthlyInputTransformed
  | BeefCows1To2YearsMonthlyInputTransformed
  | BeefCows2To3YearsMonthlyInputTransformed
  | BeefCowsGt3YearsMonthlyInputTransformed
  | BeefSteersLt1MonthlyInputTransformed
  | BeefSteers1To2YearsMonthlyInputTransformed
  | BeefSteers2To3YearsMonthlyInputTransformed
  | BeefSteersGt3YearsMonthlyInputTransformed;
