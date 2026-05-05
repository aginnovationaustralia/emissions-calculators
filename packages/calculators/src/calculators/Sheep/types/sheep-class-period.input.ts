import { input } from '@/tools/inputs';
import { days, head, mass, massPerArea, realNumber } from '@/tools/units';
import { object, percentage } from '@/types/schemas';
import { mapOptional } from '@/tools/zod';
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
    .transform(
      mapOptional((val) => input('Wijkln', mass('Liveweight', val))),
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
    .transform(
      mapOptional((val) => input('DMDjk', realNumber(val))),
    ),
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

export const isSeasonInputWithLambing = (
  period:
    | SheepClassPeriodInputTransformed
    | SheepClassWithLambingPeriodInputTransformed,
): period is SheepClassWithLambingPeriodInputTransformed => {
  return 'percentLambing' in period;
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

export type SheepClassPeriodsInputTransformed =
  | SheepClassPeriodInputTransformed
  | SheepClassWithLambingPeriodInputTransformed;
