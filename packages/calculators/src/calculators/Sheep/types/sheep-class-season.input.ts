import { input } from '@/tools/inputs';
import { head, mass, massPerHeadPerDay, realNumber } from '@/tools/units';
import { object, percentage } from '@/types/schemas';
import { z } from 'zod';

export const SheepClassSeasonInputSchema = object({
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
    .transform((val) =>
      val === undefined ? undefined : input('Wijkln', mass('Liveweight', val)),
    ),
  method2LiveweightGain: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for liveweight gain for this class for this season based on farm records',
    })
    .transform((val) =>
      val === undefined
        ? undefined
        : input('LWGijkln', massPerHeadPerDay('Liveweight', val)),
    ),
});

export const SheepClassWithLambingSeasonInputSchema =
  SheepClassSeasonInputSchema.extend({
    percentLambing: percentage()
      .meta({
        description: 'Percentage of ewes lambing in this season.',
      })
      .transform((val) => input('LRjk', realNumber(val))),
    percentLambMarking: percentage()
      .meta({
        description: 'Percentage of lamb marking in this season.',
      })
      .transform((val) => input('LMRjk', realNumber(val))),
  });

export const isSeasonInputWithLambing = (
  season:
    | SheepClassSeasonInputTransformed
    | SheepClassWithLambingSeasonInputTransformed,
): season is SheepClassWithLambingSeasonInputTransformed => {
  return 'percentLambing' in season;
};

export type SheepClassSeasonInput = z.input<typeof SheepClassSeasonInputSchema>;
export type SheepClassSeasonInputTransformed = z.output<
  typeof SheepClassSeasonInputSchema
>;

export type SheepClassWithLambingSeasonInput = z.input<
  typeof SheepClassWithLambingSeasonInputSchema
>;
export type SheepClassWithLambingSeasonInputTransformed = z.output<
  typeof SheepClassWithLambingSeasonInputSchema
>;
