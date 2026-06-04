import { input } from '@/tools/inputs';
import {
  days,
  head,
  mass,
  massPerArea,
  massPerHeadPerDay,
  realNumber,
} from '@/tools/units';
import { mapOptional } from '@/tools/zod';
import { object, percentage, proportion } from '@/types/schemas';
import { z } from 'zod';

export const SheepClassPeriodInputSchema = object({
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
    .transform(mapOptional((val) => input('Wjk', mass('Liveweight', val)))),
  method2LiveweightGain: z
    .number()
    .min(0)
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for liveweight gain for this class for this season based on farm records',
    })
    .transform(
      mapOptional((val) =>
        input('LWGjk', massPerHeadPerDay('Liveweight', val)),
      ),
    ),
  method2DryMatterAvailability: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for dry matter availability for this class for this period based on farm records',
    })
    .transform(
      mapOptional((val) => input('DMAjk', massPerArea('DryMatter', val))),
    ),
  method2DryMatterDigestibility: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for dry matter digestibility for this class for this period based on farm records',
    })
    .transform(mapOptional((val) => input('DMDjk', realNumber(val)))),
  method2AverageDurationDays: z
    .number()
    .optional()
    .meta({
      description:
        'Method 2: supply an exact value for average duration days for this class for this period based on farm records',
    })
    .transform(mapOptional((val) => input('Dj', days(val)))),
});

export const SheepClassWithLambingPeriodInputSchema =
  SheepClassPeriodInputSchema.extend({
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

export const SheepClassWithProportionLambsBornPeriodInputSchema =
  SheepClassPeriodInputSchema.extend({
    proportionOfLambsBorn: proportion()
      .meta({
        description: 'Proportion of lambs born in this time period.',
      })
      .transform((val) => input('PLBjk', realNumber(val))),
  });

export const isSeasonInputWithLambing = (
  period: SheepClassPeriodsInputTransformed,
): period is SheepClassWithLambingPeriodInputTransformed => {
  return 'percentLambing' in period;
};

export const isSeasonInputWithProportionLambsBorn = (
  period: SheepClassPeriodsInputTransformed,
): period is SheepClassWithProportionLambsBornPeriodInputTransformed => {
  return 'proportionOfLambsBorn' in period;
};

export type SheepClassPeriodInput = z.input<typeof SheepClassPeriodInputSchema>;
export type SheepClassPeriodInputTransformed = z.output<
  typeof SheepClassPeriodInputSchema
>;

export type SheepClassWithLambingPeriodInput = z.input<
  typeof SheepClassWithLambingPeriodInputSchema
>;
export type SheepClassWithLambingPeriodInputTransformed = z.output<
  typeof SheepClassWithLambingPeriodInputSchema
>;

export type SheepClassWithProportionLambsBornPeriodInput = z.input<
  typeof SheepClassWithProportionLambsBornPeriodInputSchema
>;
export type SheepClassWithProportionLambsBornPeriodInputTransformed = z.output<
  typeof SheepClassWithProportionLambsBornPeriodInputSchema
>;

export type SheepClassPeriodsInputTransformed =
  | SheepClassPeriodInputTransformed
  | SheepClassWithLambingPeriodInputTransformed
  | SheepClassWithProportionLambsBornPeriodInputTransformed;
