import {
  getPreviousMonth,
  getPreviousSeason,
  Month,
  Season,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { days, head, mass, massPerHeadPerDay, realNumber } from '@/tools/units';
import { mapOptional } from '@/tools/zod';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const BeefClassPeriodInputSchema = object({
  head: z
    .number()
    .min(0)
    .meta({ description: 'Number of head for this class for this season' })
    .transform((val) => input('Nkln', head(val))),
  method2Liveweight: z
    .number()
    .min(0)
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for liveweight for this class for this season based on farm records',
    })
    .transform(mapOptional((val) => input('Wijkln', mass('Liveweight', val)))),
  method2LiveweightGain: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for liveweight gain for this class for this season based on farm records',
    })
    .transform(
      mapOptional((val) =>
        input('LWGijkln', massPerHeadPerDay('Liveweight', val)),
      ),
    ),
  method2DurationDays: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for the average duration of animals in this class for this time period in days, based on farm records',
    })
    .transform(mapOptional((val) => input('Djk', days(val)))),
  method2DryMatterIntake: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for the dry matter intake for this class for this time period based on farm records',
    })
    .transform(
      mapOptional((val) => input('Ijk', massPerHeadPerDay('DryMatter', val))),
    ),
});

export const BeefClassWithCalvesPeriodInputSchema =
  BeefClassPeriodInputSchema.extend({
    proportionCowsGt2ThisSeasonInCalf: proportion().transform((val) =>
      input('Cows > 2 years calving this period', realNumber(val)),
    ),
    proportionCowsGt2PreviousSeasonInCalf: proportion().transform((val) =>
      input('Cows > 2 years calving previous period', realNumber(val)),
    ),
  });

export const createBeefClassWithCalvesSeasonalInputSchema = (
  thisSeason: Season,
) =>
  BeefClassPeriodInputSchema.extend({
    proportionCowsGt2ThisSeasonInCalf: proportion()
      .meta({
        description: `Proportion of cows > 2 years in the herd during ${thisSeason} that calved in that season.`,
      })
      .transform((val) =>
        input('Cows > 2 years calving this season', realNumber(val)),
      ),
    proportionCowsGt2PreviousSeasonInCalf: proportion()
      .meta({
        description: `Proportion of cows > 2 years in the herd during ${thisSeason} that calved in the previous ${getPreviousSeason(thisSeason)} season.`,
      })
      .transform((val) =>
        input('Cows > 2 years calving previous season', realNumber(val)),
      ),
  });

export const createBeefClassWithCalvesMonthlyInputSchema = (
  thisMonth: Month,
) => {
  const previousMonth1 = getPreviousMonth(thisMonth, 1);
  const previousMonth2 = getPreviousMonth(thisMonth, 2);
  const previousMonth3 = getPreviousMonth(thisMonth, 3);
  const previousMonth4 = getPreviousMonth(thisMonth, 4);
  const previousMonth5 = getPreviousMonth(thisMonth, 5);

  return BeefClassPeriodInputSchema.extend({
    proportionCowsGt2ThisSeasonInCalf: proportion()
      .meta({
        description: `Proportion of cows > 2 years in the herd during ${thisMonth} that calved in that month of ${thisMonth}, or the immediate prior 2 months (${previousMonth1} or ${previousMonth2}).`,
      })
      .transform((val) =>
        input('Cows > 2 years calving this season', realNumber(val)),
      ),
    proportionCowsGt2PreviousSeasonInCalf: proportion()
      .meta({
        description: `Proportion of cows > 2 years in the herd during ${thisMonth} that calved in the "previous season", which means the previous ${previousMonth3}, ${previousMonth4} or ${previousMonth5}.`,
      })
      .transform((val) =>
        input('Cows > 2 years calving previous season', realNumber(val)),
      ),
  });
};

export const isSeasonInputWithCalves = (
  season:
    | BeefClassSeasonInputTransformed
    | BeefClassWithCalvesSeasonInputTransformed,
): season is BeefClassWithCalvesSeasonInputTransformed => {
  return 'proportionCowsGt2ThisSeasonInCalf' in season;
};

export type BeefClassSeasonInput = z.input<typeof BeefClassPeriodInputSchema>;
export type BeefClassSeasonInputTransformed = z.output<
  typeof BeefClassPeriodInputSchema
>;

export type BeefClassWithCalvesSeasonInput = z.input<
  typeof BeefClassWithCalvesPeriodInputSchema
>;
export type BeefClassWithCalvesSeasonInputTransformed = z.output<
  typeof BeefClassWithCalvesPeriodInputSchema
>;

export type BeefClassPeriodInputTransformed = z.output<
  typeof BeefClassPeriodInputSchema
>;
export type BeefClassWithCalvesPeriodInputTransformed = z.output<
  typeof BeefClassWithCalvesPeriodInputSchema
>;

export type BeefClassPeriodsInputTransformed =
  | BeefClassPeriodInputTransformed
  | BeefClassWithCalvesPeriodInputTransformed;
