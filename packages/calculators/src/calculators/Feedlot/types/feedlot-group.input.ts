import { input } from '@/tools/inputs';
import { days, head, massPerHeadPerDay, percentage } from '@/tools/units';
import { object, percentage as percentageSchema } from '@/types/schemas';
import { z } from 'zod';

export const FeedlotGroupInputSchema = object({
  head: z
    .number()
    .min(0)
    .meta({ description: 'Number of animals in group' })
    .transform((val) => input('Nj', head(val))),
  averageLengthOfStayDays: z
    .number()
    .min(0)
    .meta({ description: 'Average length of stay in days' })
    .transform((val) => input('Lj', days(val))),
  method2AverageDryMatterIntake: z
    .number()
    .min(0)
    .meta({ description: 'Method 2: Average dry matter intake in kg/head/day' })
    .optional()
    .transform((val) =>
      val === undefined
        ? undefined
        : input('Ij', massPerHeadPerDay('DryMatter', val)),
    ),
  method2AverageNeutralDetergentFibrePercentage: percentageSchema(
    'Method 2: Average neutral detergent fibre as a percentage of feed intake',
  )
    .optional()
    .transform((val) =>
      val === undefined ? undefined : input('NDFj', percentage(val)),
    ),
});

export type FeedlotGroupInput = z.input<typeof FeedlotGroupInputSchema>;
export type FeedlotGroupInputTransformed = z.output<
  typeof FeedlotGroupInputSchema
>;
