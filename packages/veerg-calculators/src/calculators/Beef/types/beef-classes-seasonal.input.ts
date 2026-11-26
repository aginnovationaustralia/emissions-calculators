import { Seasons } from '@/constants/enums';
import {
  getSeasonsForSeasonAfterCalving,
  getSeasonsForSeasonOfCalving,
} from '@/modules/scope1/shared/beef/calving-seasons';
import { enumInput } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';
import { checkHerdCalving } from './beef-calving-validation';
import {
  BeefCalfClassSeasonalInputSchema,
  BeefClassSeasonalInputSchema,
  BeefClassWithCalvesSeasonalInputSchema,
} from './beef-class.input';

const BeefBullsLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'bullsLt1' as const,
    number: '1' as const,
  }));

const BeefBullsGt1SeasonalInputSchema = BeefClassSeasonalInputSchema.transform(
  (val) => ({
    ...val,
    name: 'bullsGt1' as const,
    number: '2' as const,
  }),
);

const BeefCowsLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cowsLt1' as const,
    number: '3' as const,
  }));

const BeefCows1To2YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cows1To2Years' as const,
    number: '4' as const,
  }));

const BeefCows2To3YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cows2To3Years' as const,
    number: '5a' as const,
  }));

const BeefCowsGt3YearsSeasonalInputSchema =
  BeefClassWithCalvesSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'cowsGt3Years' as const,
    number: '5b' as const,
  }));

const BeefSteersLt1SeasonalInputSchema =
  BeefCalfClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steersLt1' as const,
    number: '6' as const,
  }));

const BeefSteers1To2YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steers1To2Years' as const,
    number: '7a' as const,
  }));

const BeefSteers2To3YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steers2To3Years' as const,
    number: '7b' as const,
  }));

const BeefSteersGt3YearsSeasonalInputSchema =
  BeefClassSeasonalInputSchema.transform((val) => ({
    ...val,
    name: 'steersGt3Years' as const,
    number: '7c' as const,
  }));

export const BeefClassesSeasonalInputSchema = object({
  period: z.literal('seasonal'),
  calvingSeasons: z
    .array(
      enumInput(Seasons, {
        name: 'Calving season',
        method: '1',
        description: 'A season in which the herd calves.',
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      }),
    )
    .meta({
      description:
        "The seasons in which the herd calves. LCjk=4,5 is applied to the calving season and the season immediately after it, and is 0 for all other seasons (Chapter 3, 3.2.1.1 (4)): in a calving season it is the class's fractionCowsCalving for that season, and in the season after it the fractionCowsCalving of the calving season. The calves' shares are worked out the same way from calvesBorn. Give an empty list for a herd that does not calve.",
    }),
  bullsLt1: BeefBullsLt1SeasonalInputSchema.optional(),
  bullsGt1: BeefBullsGt1SeasonalInputSchema.optional(),
  cowsLt1: BeefCowsLt1SeasonalInputSchema.optional(),
  cows1To2Years: BeefCows1To2YearsSeasonalInputSchema.optional(),
  cows2To3Years: BeefCows2To3YearsSeasonalInputSchema.optional(),
  cowsGt3Years: BeefCowsGt3YearsSeasonalInputSchema.optional(),
  steersLt1: BeefSteersLt1SeasonalInputSchema.optional(),
  steers1To2Years: BeefSteers1To2YearsSeasonalInputSchema.optional(),
  steers2To3Years: BeefSteers2To3YearsSeasonalInputSchema.optional(),
  steersGt3Years: BeefSteersGt3YearsSeasonalInputSchema.optional(),
})
  .superRefine((classes, ctx) =>
    checkHerdCalving(ctx, {
      classes,
      periods: Seasons,
      calvingSeasonsKey: 'calvingSeasons',
      calvingSeasons: classes.calvingSeasons.map((s) => s.unit),
      getSeasonOfCalving: getSeasonsForSeasonOfCalving,
      getSeasonAfterCalving: getSeasonsForSeasonAfterCalving,
    }),
  )
  .meta({
    title: 'Beef classes with seasonal input',
  });

export type BeefClassesSeasonalInput = z.input<
  typeof BeefClassesSeasonalInputSchema
>;

export type BeefBullsLt1SeasonalInputTransformed = z.output<
  typeof BeefBullsLt1SeasonalInputSchema
>;
export type BeefBullsGt1SeasonalInputTransformed = z.output<
  typeof BeefBullsGt1SeasonalInputSchema
>;
export type BeefCowsLt1SeasonalInputTransformed = z.output<
  typeof BeefCowsLt1SeasonalInputSchema
>;
export type BeefCows1To2YearsSeasonalInputTransformed = z.output<
  typeof BeefCows1To2YearsSeasonalInputSchema
>;
export type BeefCows2To3YearsSeasonalInputTransformed = z.output<
  typeof BeefCows2To3YearsSeasonalInputSchema
>;
export type BeefCowsGt3YearsSeasonalInputTransformed = z.output<
  typeof BeefCowsGt3YearsSeasonalInputSchema
>;
export type BeefSteersLt1SeasonalInputTransformed = z.output<
  typeof BeefSteersLt1SeasonalInputSchema
>;
export type BeefSteers1To2YearsSeasonalInputTransformed = z.output<
  typeof BeefSteers1To2YearsSeasonalInputSchema
>;
export type BeefSteers2To3YearsSeasonalInputTransformed = z.output<
  typeof BeefSteers2To3YearsSeasonalInputSchema
>;
export type BeefSteersGt3YearsSeasonalInputTransformed = z.output<
  typeof BeefSteersGt3YearsSeasonalInputSchema
>;

export type BeefSpecificClassSeasonalInputTransformed =
  | BeefBullsLt1SeasonalInputTransformed
  | BeefBullsGt1SeasonalInputTransformed
  | BeefCowsLt1SeasonalInputTransformed
  | BeefCows1To2YearsSeasonalInputTransformed
  | BeefCows2To3YearsSeasonalInputTransformed
  | BeefCowsGt3YearsSeasonalInputTransformed
  | BeefSteersLt1SeasonalInputTransformed
  | BeefSteers1To2YearsSeasonalInputTransformed
  | BeefSteers2To3YearsSeasonalInputTransformed
  | BeefSteersGt3YearsSeasonalInputTransformed;
