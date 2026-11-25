import { getPreviousSeason, Month, Season } from '@/constants/enums';
import { isProportion, numberInput, numberInputOptional } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import {
  days,
  head,
  liveweight,
  liveweightGain,
  massPerHeadPerDay,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const BeefClassPeriodInputSchema = object({
  head: numberInput(
    (val) => head(val),
    {
      name: 'Nkln',
      method: '1',
      description: 'Number of animals in this class for this period',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2LiveweightKilograms: numberInputOptional(
    (value) => liveweight(value),
    {
      name: 'Wijkln',
      method: '2',
      description:
        'Method 2: supply an exact value for liveweight for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2DailyLiveweightGainKilograms: numberInputOptional(
    (val) => liveweightGain(val),
    {
      name: 'LWGijkln',
      method: '2',
      description:
        'Method 2: supply an exact value for liveweight gain for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
  ),
  method2DurationDays: numberInputOptional(
    (val) => days(val),
    {
      name: 'Djk',
      method: '2',
      description:
        'Method 2: supply an exact value for the average duration of animals in this class for this time period, based on farm records',
      modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
    },
    (s) => s.min(0),
  ),
  method2DailyDryMatterIntakeKilograms: numberInputOptional(
    (val) => massPerHeadPerDay('DryMatter', val),
    {
      name: 'Ijk',
      method: '2',
      description:
        'Method 2: supply an exact value for the dry matter intake for this class for this time period based on farm records',
      modules: [ENTERIC_BEEF_3_2],
    },
    (s) => s.min(0),
  ),
  method2FractionDryMatterDigestibility: numberInputOptional(
    realNumber,
    {
      name: 'DMDijk',
      method: '2',
      description:
        'Method 2: Specific dry matter digestibility for this class for this time period, based on farm records',
      modules: [MANURE_BEEF_4_2],
    },
    isProportion,
  ),
  method2FractionCrudeProteinContent: numberInputOptional(
    (val) => massPerMass('CrudeProtein', 'DryMatter', val),
    {
      name: 'CPijk=spring',
      method: '2',
      description:
        'Method 2: Specific crude protein content for this class for this time period, based on farm records',
      modules: [MANURE_BEEF_4_2],
    },
    isProportion,
  ),
}).meta({ id: 'BeefClassPeriodInput' });

export type BeefClassPeriodInput = z.input<typeof BeefClassPeriodInputSchema>;
export type BeefClassPeriodInputTransformed = z.output<
  typeof BeefClassPeriodInputSchema
>;

export const createBeefClassSeasonalPeriodWithCalvesInputSchema = (
  thisSeason: Season,
) =>
  BeefClassPeriodInputSchema.extend({
    fractionCowsThisSeasonInCalf: numberInput(
      (val) => realNumber(val),
      {
        name: 'LC (calving)',
        method: '1',
        description: `Proportion of cows in this class during ${thisSeason} that calved in that season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCowsPreviousSeasonInCalf: numberInput(
      (val) => realNumber(val),
      {
        name: 'LC (post-calving)',
        method: '1',
        description: `Proportion of cows in this class during ${thisSeason} that calved in the previous ${getPreviousSeason(thisSeason)} season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    const totalCalving = val.fractionCowsThisSeasonInCalf.plus(
      val.fractionCowsPreviousSeasonInCalf,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisSeason}.fractionCowsThisSeasonInCalf and ${thisSeason}.fractionCowsPreviousSeasonInCalf should not exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });

export const createBeefClassMonthlyPeriodWithCalvesInputSchema = (
  thisMonth: Month,
) => {
  // A monthly herd gives its calving one of two ways (checked across the whole herd in
  // beef-classes-monthly.input.ts):
  // - with `calvingSeasonStartMonths` on the classes: `fractionCowsCalvingThisMonth` for
  //   every month, and the calculation derives LC for the fixed 3-month calving seasons
  //   (Chapter 3, 3.2.2.1 LCjk=4,5), see shared/beef/calving.ts
  // - without: `fractionCowsThisSeasonInCalf` and `fractionCowsPreviousSeasonInCalf`
  //   for every month, the LC values for that month as already worked out by the caller
  return BeefClassPeriodInputSchema.extend({
    fractionCowsCalvingThisMonth: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'Cows calving this month',
        method: '2',
        description: `Proportion of cows in this class that calved in ${thisMonth}. Used with calvingSeasonStartMonths: the calving season is the 3 months from a start month, and LCjk=4,5 for each month of it is the sum of these proportions over the season (Chapter 3, 3.2.2.1).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCowsThisSeasonInCalf: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'Cows calving this season',
        method: '1',
        description: `Proportion of cows in this class during ${thisMonth} that calved in the calving season that ${thisMonth} is part of (LCjk=4,5 for the season of calving). Not used when calvingSeasonStartMonths is given. Under Method 2 herd flow the calving season is the 3 months from the calving month (Chapter 3, 3.2.2.1); 0 if ${thisMonth} is in no calving season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCowsPreviousSeasonInCalf: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'Cows calving previous season',
        method: '1',
        description: `Proportion of cows in this class during ${thisMonth} that calved in the calving season before it, i.e. the season after calving is the 3 months after a calving season (LCjk=4,5 for the season after calving; Chapter 3, 3.2.2.1). Not used when calvingSeasonStartMonths is given. 0 if ${thisMonth} is in no season after calving.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    if (
      val.fractionCowsThisSeasonInCalf === undefined ||
      val.fractionCowsPreviousSeasonInCalf === undefined
    ) {
      return;
    }
    const totalCalving = val.fractionCowsThisSeasonInCalf.plus(
      val.fractionCowsPreviousSeasonInCalf,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisMonth}.fractionCowsThisSeasonInCalf and ${thisMonth}.fractionCowsPreviousSeasonInCalf should not exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });
};

type BeefClassMonthlyPeriodWithCalvesInputSchemaType = ReturnType<
  typeof createBeefClassMonthlyPeriodWithCalvesInputSchema
>;
export type BeefClassMonthlyPeriodWithCalvesInputTransformed =
  z.output<BeefClassMonthlyPeriodWithCalvesInputSchemaType>;

type BeefClassWithCalvesPeriodInputSchemaType = ReturnType<
  typeof createBeefClassSeasonalPeriodWithCalvesInputSchema
>;

export type BeefClassPeriodWithCalvesInput =
  z.input<BeefClassWithCalvesPeriodInputSchemaType>;
export type BeefClassPeriodWithCalvesInputTransformed =
  z.output<BeefClassWithCalvesPeriodInputSchemaType>;

export const createBeefCalfClassSeasonalPeriodWithInputSchema = (
  thisSeason: Season,
) =>
  BeefClassPeriodInputSchema.extend({
    fractionCalvesBornThisSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'fractionCalvesBornThisSeason',
        method: '1',
        description: `Proportion of calves in ${thisSeason} in this class that were born in this season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCalvesBornPreviousSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'fractionCalvesBornPreviousSeason',
        method: '1',
        description: `Proportion of calves in ${thisSeason} in this class that were born in the previous season (${getPreviousSeason(thisSeason)}).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    const totalCalving = val.fractionCalvesBornThisSeason.plus(
      val.fractionCalvesBornPreviousSeason,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisSeason}.fractionCalvesBornThisSeason and ${thisSeason}.fractionCalvesBornPreviousSeason cannot exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });

export const createBeefCalfClassMonthlyPeriodInputSchema = (
  thisMonth: Month,
) => {
  // As for cows (createBeefClassMonthlyPeriodWithCalvesInputSchema): either
  // `fractionCalvesBornThisMonth` with the classes' `calvingSeasonStartMonths`, or the
  // season fractions for the month as already worked out by the caller.
  return BeefClassPeriodInputSchema.extend({
    fractionCalvesBornThisMonth: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'Calves born this month',
        method: '2',
        description: `Proportion of calves in this class that were born in ${thisMonth}. Used with calvingSeasonStartMonths: the calving season is the 3 months from a start month, and the proportion born in the season for each month of it is the sum of these proportions over the season (4.2.1.3 (3), milk intake MCjk=1,3,6).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCalvesBornThisSeason: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'fractionCalvesBornThisSeason',
        method: '1',
        description: `Proportion of calves in this class during ${thisMonth} that were born in the calving season that ${thisMonth} is part of. Not used when calvingSeasonStartMonths is given. Under Method 2 herd flow the calving season is the 3 months from the calving month (Chapter 3, 3.2.2.1); 0 if ${thisMonth} is in no calving season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    fractionCalvesBornPreviousSeason: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'fractionCalvesBornPreviousSeason',
        method: '1',
        description: `Proportion of calves in this class during ${thisMonth} that were born in the calving season before it, i.e. ${thisMonth} is in the 3 months after a calving season. Not used when calvingSeasonStartMonths is given. 0 if ${thisMonth} is in no season after calving.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    if (
      val.fractionCalvesBornThisSeason === undefined ||
      val.fractionCalvesBornPreviousSeason === undefined
    ) {
      return;
    }
    const totalCalving = val.fractionCalvesBornThisSeason.plus(
      val.fractionCalvesBornPreviousSeason,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisMonth}.fractionCalvesBornThisSeason and ${thisMonth}.fractionCalvesBornPreviousSeason cannot exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });
};

type BeefCalfClassPeriodInputSchemaType = ReturnType<
  typeof createBeefCalfClassSeasonalPeriodWithInputSchema
>;
export type BeefCalfClassPeriodInput =
  z.input<BeefCalfClassPeriodInputSchemaType>;
export type BeefCalfClassPeriodInputTransformed =
  z.output<BeefCalfClassPeriodInputSchemaType>;

type BeefCalfClassMonthlyPeriodInputSchemaType = ReturnType<
  typeof createBeefCalfClassMonthlyPeriodInputSchema
>;
export type BeefCalfClassMonthlyPeriodInputTransformed =
  z.output<BeefCalfClassMonthlyPeriodInputSchemaType>;

export type BeefClassPeriodExtendedInputTransformed =
  | BeefClassPeriodInputTransformed
  | BeefClassPeriodWithCalvesInputTransformed
  | BeefClassMonthlyPeriodWithCalvesInputTransformed
  | BeefCalfClassPeriodInputTransformed
  | BeefCalfClassMonthlyPeriodInputTransformed;

const hasDefined = (period: object, key: string) =>
  key in period && (period as Record<string, unknown>)[key] !== undefined;

/** A cow class period (k=4,5), seasonal or monthly, in either form of calving input. */
export const isBeefClassPeriodInputWithCalves = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is
  | BeefClassPeriodWithCalvesInputTransformed
  | BeefClassMonthlyPeriodWithCalvesInputTransformed => {
  return (
    hasDefined(period, 'fractionCowsThisSeasonInCalf') ||
    hasDefined(period, 'fractionCowsCalvingThisMonth')
  );
};

/** A calf class period (k=1,3,6), seasonal or monthly, in either form of calving input. */
export const isBeefCalfClassPeriodInput = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is
  | BeefCalfClassPeriodInputTransformed
  | BeefCalfClassMonthlyPeriodInputTransformed => {
  return (
    hasDefined(period, 'fractionCalvesBornThisSeason') ||
    hasDefined(period, 'fractionCalvesBornThisMonth')
  );
};
