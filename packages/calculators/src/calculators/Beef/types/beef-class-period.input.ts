import { Season } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { head, mass, massPerHeadPerDay, realNumber } from '@/tools/units';
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
});

export const BeefClassWithCalvesPeriodInputSchema =
  BeefClassPeriodInputSchema.extend({
    proportionCowsGt2ThisSeasonInCalf: proportion()
      .meta({
        description:
          'Proportion of cows > 2 years in calf in this season. Do not include cows that were in calf in the previous season.',
      })
      .transform((val) =>
        input('Cows > 2 years calving this season', realNumber(val)),
      ),
  });

export const createBeefClassWithCalvesSeasonalInputSchema = (
  thisSeason: Season,
  previousSeason: Season,
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
        description: `Proportion of cows > 2 years in the herd during ${thisSeason} that calved in the previous ${previousSeason} season.`,
      })
      .transform((val) =>
        input('Cows > 2 years calving previous season', realNumber(val)),
      ),
  });

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
