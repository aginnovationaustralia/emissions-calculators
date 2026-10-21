import {
  getPreviousMonth,
  getPreviousSeason,
  Month,
  Season,
} from '@/constants/enums';
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
  method2Liveweight: numberInputOptional(
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
  method2LiveweightGain: numberInputOptional((val) => liveweightGain(val), {
    name: 'LWGijkln',
    method: '2',
    description:
      'Method 2: supply an exact value for liveweight gain for this class for this time period based on farm records',
    modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
  }),
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
  method2DryMatterIntake: numberInputOptional(
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
  method2DryMatterDigestibility: numberInputOptional(
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
  method2CrudeProteinContent: numberInputOptional(
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
    proportionCowsThisSeasonInCalf: numberInput(
      (val) => realNumber(val),
      {
        name: 'LC (calving)',
        method: '1',
        description: `Proportion of cows in this class during ${thisSeason} that calved in that season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    proportionCowsPreviousSeasonInCalf: numberInput(
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
    const totalCalving = val.proportionCowsThisSeasonInCalf.plus(
      val.proportionCowsPreviousSeasonInCalf,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisSeason}.proportionCowsThisSeasonInCalf and ${thisSeason}.proportionCowsPreviousSeasonInCalf should not exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });

export const createBeefClassMonthlyPeriodWithCalvesInputSchema = (
  thisMonth: Month,
) => {
  const previousMonth1 = getPreviousMonth(thisMonth, 1);
  const previousMonth2 = getPreviousMonth(thisMonth, 2);
  const previousMonth3 = getPreviousMonth(thisMonth, 3);
  const previousMonth4 = getPreviousMonth(thisMonth, 4);
  const previousMonth5 = getPreviousMonth(thisMonth, 5);

  return BeefClassPeriodInputSchema.extend({
    proportionCowsThisSeasonInCalf: numberInput(
      (val) => realNumber(val),
      {
        name: 'Cows calving this season',
        method: '1',
        description: `Proportion of cows in this class during ${thisMonth} that calved in that month of ${thisMonth}, or the immediate prior 2 months (${previousMonth1} or ${previousMonth2}).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    proportionCowsPreviousSeasonInCalf: numberInput(
      (val) => realNumber(val),
      {
        name: 'Cows calving previous season',
        method: '1',
        description: `Proportion of cows in this class during ${thisMonth} that calved in the "previous season", which means the previous ${previousMonth3}, ${previousMonth4} or ${previousMonth5}.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    const totalCalving = val.proportionCowsThisSeasonInCalf.plus(
      val.proportionCowsPreviousSeasonInCalf,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisMonth}.proportionCowsThisSeasonInCalf and ${thisMonth}.proportionCowsPreviousSeasonInCalf should not exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });
};

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
    proportionCalvesBornThisSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'proportionCalvesBornThisSeason',
        method: '1',
        description: `Proportion of calves in ${thisSeason} in this class that were born in this season.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    proportionCalvesBornPreviousSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'proportionCalvesBornPreviousSeason',
        method: '1',
        description: `Proportion of calves in ${thisSeason} in this class that were born in the previous season (${getPreviousSeason(thisSeason)}).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    const totalCalving = val.proportionCalvesBornThisSeason.plus(
      val.proportionCalvesBornPreviousSeason,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisSeason}.proportionCalvesBornThisSeason and ${thisSeason}.proportionCalvesBornPreviousSeason cannot exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
      );
    }
  });

export const createBeefCalfClassMonthlyPeriodInputSchema = (
  thisMonth: Month,
) => {
  const previousMonth1 = getPreviousMonth(thisMonth, 1);
  const previousMonth2 = getPreviousMonth(thisMonth, 2);
  const previousMonth3 = getPreviousMonth(thisMonth, 3);
  const previousMonth4 = getPreviousMonth(thisMonth, 4);
  const previousMonth5 = getPreviousMonth(thisMonth, 5);

  return BeefClassPeriodInputSchema.extend({
    proportionCalvesBornThisSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'proportionCalvesBornThisSeason',
        method: '1',
        description: `Proportion of calves in this class during ${thisMonth} that were born in this month (${thisMonth}), or the immediate prior 2 months (${previousMonth1} or ${previousMonth2}).`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
    proportionCalvesBornPreviousSeason: numberInput(
      (val) => realNumber(val),
      {
        name: 'proportionCalvesBornPreviousSeason',
        method: '1',
        description: `Proportion of calves in this class during ${thisMonth} that were born in the "previous season", which means the previous ${previousMonth3}, ${previousMonth4} or ${previousMonth5}.`,
        modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
      },
      isProportion,
    ),
  }).superRefine((val, ctx) => {
    const totalCalving = val.proportionCalvesBornThisSeason.plus(
      val.proportionCalvesBornPreviousSeason,
    ).unit.store.value;
    if (totalCalving.toNumber() > 1) {
      ctx.addIssue(
        `The sum of ${thisMonth}.proportionCalvesBornThisSeason and ${thisMonth}.proportionCalvesBornPreviousSeason cannot exceed 1 (current total: ${totalCalving}). Adjust either or both keys so they are equal to or less than 1.`,
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

export type BeefClassPeriodExtendedInputTransformed =
  | BeefClassPeriodInputTransformed
  | BeefClassPeriodWithCalvesInputTransformed
  | BeefCalfClassPeriodInputTransformed;

export const isBeefClassPeriodInputWithCalves = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is BeefClassPeriodWithCalvesInputTransformed => {
  return 'proportionCowsThisSeasonInCalf' in period;
};

export const isBeefCalfClassPeriodInput = (
  period: BeefClassPeriodExtendedInputTransformed,
): period is BeefCalfClassPeriodInputTransformed => {
  return 'proportionCalvesBornThisSeason' in period;
};
