import { input } from '@/tools/inputs';
import { head } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const BeefClassSeasonInputSchema = object({
  head: z
    .number()
    .min(0)
    .meta({ description: 'Number of head for this class for this season' })
    .transform((val) => input('Nkln', head(val))),
});

export const BeefClassWithCalvesSeasonInputSchema =
  BeefClassSeasonInputSchema.extend({
    proportionCowsGt2InCalf: proportion().meta({
      description:
        'Proportion of cows > 2 years in calf in the season of calving and the season immediately after calving',
    }),
  });

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
