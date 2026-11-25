import { Month, Months } from '@/constants/enums';
import {
  getMonthsForSeasonAfterCalving,
  getMonthsForSeasonOfCalving,
} from '@/modules/scope1/shared/beef/calving-seasons';
import { enumInput, InputContainer } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import { RealNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';
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

const COW_CLASSES = ['cows1To2Years', 'cows2To3Years', 'cowsGt3Years'] as const;
const CALF_CLASSES = ['bullsLt1', 'cowsLt1', 'steersLt1'] as const;

export const BeefClassesMonthlyInputSchema = object({
  period: z.literal('monthly'),
  calvingSeasonStartMonths: z
    .array(
      enumInput(Months, {
        name: 'Calving season start month',
        method: '2',
        description: 'A month in which a calving season starts.',
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      }),
    )
    .optional()
    .meta({
      description:
        "The months in which the herd's calving seasons start. When given, each calving season is the 3 months from its start month and the season after calving is the 3 months after that (Chapter 3, 3.2.2.1 LCjk=4,5, Method 2 herd flow). The cow classes then give fractionCowsCalvingThisMonth and the calf classes fractionCalvesBornThisMonth for every month, and LCjk=4,5 and the calves' shares for the season of calving and the season after it are derived from them. Give an empty list for a herd that does not calve. When not given, every month of the cow and calf classes gives the season fractions directly (fractionCowsThisSeasonInCalf, fractionCowsPreviousSeasonInCalf, fractionCalvesBornThisSeason, fractionCalvesBornPreviousSeason).",
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
  .superRefine((classes, ctx) => {
    const startMonths = classes.calvingSeasonStartMonths?.map((m) => m.unit);
    const checks = [
      ...COW_CLASSES.map((className) => ({
        className,
        perMonth: 'fractionCowsCalvingThisMonth',
        perSeason: [
          'fractionCowsThisSeasonInCalf',
          'fractionCowsPreviousSeasonInCalf',
        ],
      })),
      ...CALF_CLASSES.map((className) => ({
        className,
        perMonth: 'fractionCalvesBornThisMonth',
        perSeason: [
          'fractionCalvesBornThisSeason',
          'fractionCalvesBornPreviousSeason',
        ],
      })),
    ];

    if (startMonths !== undefined) {
      const repeated = startMonths.filter(
        (m, i) => startMonths.indexOf(m) !== i,
      );
      if (repeated.length > 0) {
        ctx.addIssue(
          `calvingSeasonStartMonths lists ${repeated.join(', ')} more than once.`,
        );
      }
    }

    for (const { className, perMonth, perSeason } of checks) {
      const cls = classes[className] as unknown as
        | Record<Month, Record<string, InputContainer<RealNumber> | undefined>>
        | undefined;
      if (!cls) {
        continue;
      }
      const valueOf = (month: Month, key: string) =>
        cls[month][key]?.unit.store.value.toNumber();

      for (const month of Months) {
        if (startMonths !== undefined) {
          if (valueOf(month, perMonth) === undefined) {
            ctx.addIssue(
              `${className}.${month}.${perMonth} is required when calvingSeasonStartMonths is given.`,
            );
          }
          for (const key of perSeason) {
            if (valueOf(month, key) !== undefined) {
              ctx.addIssue(
                `${className}.${month}.${key} can't be given with calvingSeasonStartMonths: it is derived from ${perMonth} and the calving season start months.`,
              );
            }
          }
        } else {
          for (const key of perSeason) {
            if (valueOf(month, key) === undefined) {
              ctx.addIssue(
                `${className}.${month}.${key} is required when calvingSeasonStartMonths is not given.`,
              );
            }
          }
          if (valueOf(month, perMonth) !== undefined) {
            ctx.addIssue(
              `${className}.${month}.${perMonth} is only used with calvingSeasonStartMonths. Give calvingSeasonStartMonths, or ${perSeason.join(' and ')} instead.`,
            );
          }
        }
      }

      if (startMonths === undefined) {
        continue;
      }
      // The derived shares for the season of calving and the season after it must not
      // exceed 1 together, as for the directly given shares
      const seasonTotal = (months: Month[]) =>
        months.reduce((total, m) => total + (valueOf(m, perMonth) ?? 0), 0);
      for (const month of Months) {
        const calving = seasonTotal(
          getMonthsForSeasonOfCalving(month, startMonths),
        );
        const afterCalving = seasonTotal(
          getMonthsForSeasonAfterCalving(month, startMonths),
        );
        if (calving + afterCalving > 1 + 1e-9) {
          const show = (n: number) => Number(n.toPrecision(12));
          ctx.addIssue(
            `${className}.${month}: the calving in its season of calving (${show(calving)}) and in its season after calving (${show(afterCalving)}) add up to more than 1. Check ${perMonth} and calvingSeasonStartMonths.`,
          );
        }
      }
    }
  })
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
