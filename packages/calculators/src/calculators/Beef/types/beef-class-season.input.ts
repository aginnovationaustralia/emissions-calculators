import { input } from '@/tools/inputs';
import { head, mass, massPerHeadPerDay, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
import { z } from 'zod';

export const BeefClassSeasonInputSchema = object({
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
    .transform(
      mapOptional((val) => input('Wijkln', mass('Liveweight', val))),
    ),
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

export const BeefClassWithCalvesSeasonInputSchema =
  BeefClassSeasonInputSchema.extend({
    proportionCowsGt2ThisSeasonInCalf: proportion()
      .meta({
        description:
          'Proportion of cows > 2 years in calf in this season. Do not include cows that were in calf in the previous season.',
      })
      .transform((val) =>
        input('Cows > 2 years calving this season', realNumber(val)),
      ),
  });

export const isSeasonInputWithCalves = (
  season:
    | BeefClassSeasonInputTransformed
    | BeefClassWithCalvesSeasonInputTransformed,
): season is BeefClassWithCalvesSeasonInputTransformed => {
  return 'proportionCowsGt2ThisSeasonInCalf' in season;
};

export type BeefClassSeasonInput = z.input<typeof BeefClassSeasonInputSchema>;
export type BeefClassSeasonInputTransformed = z.output<
  typeof BeefClassSeasonInputSchema
>;

export type BeefClassWithCalvesSeasonInput = z.input<
  typeof BeefClassWithCalvesSeasonInputSchema
>;
export type BeefClassWithCalvesSeasonInputTransformed = z.output<
  typeof BeefClassWithCalvesSeasonInputSchema
>;
