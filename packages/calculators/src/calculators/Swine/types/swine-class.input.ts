import { input } from '@/tools/inputs';
import { days, head, massPerHeadPerDay } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const SwineClassInputSchema = object({
  head: z
    .number()
    .min(0)
    .meta({ description: 'Number of head for this class' })
    .transform((val) => input('Nj', head(val))),
  averageNumberOfDays: z
    .number()
    .min(0)
    .meta({ description: 'Average number of days on farm for this class' })
    .transform((val) => input('Dj', days(val))),
  method2AverageFeedIntake: z
    .number()
    .min(0)
    .optional()
    .meta({ description: 'Average feed intake per head per class' })
    .transform((val) =>
      val === undefined
        ? undefined
        : input('Ij', massPerHeadPerDay('DryMatter', val)),
    ),
});

export const SwineBoarsInputSchema = SwineClassInputSchema.transform((val) => ({
  ...val,
  name: 'boars' as const,
  number: 1 as const,
}));
export const SwineSowsInputSchema = SwineClassInputSchema.transform((val) => ({
  ...val,
  name: 'sows' as const,
  number: 2 as const,
}));
export const SwineGiltsInputSchema = SwineClassInputSchema.transform((val) => ({
  ...val,
  name: 'gilts' as const,
  number: 3 as const,
}));
export const SwineSlaughterPigsInputSchema = SwineClassInputSchema.transform(
  (val) => ({ ...val, name: 'slaughterPigs' as const, number: 4 as const }),
);

type SwineBoarsInputTransformed = z.output<typeof SwineBoarsInputSchema>;
type SwineSowsInputTransformed = z.output<typeof SwineSowsInputSchema>;
type SwineGiltsInputTransformed = z.output<typeof SwineGiltsInputSchema>;
type SwineSlaughterPigsInputTransformed = z.output<
  typeof SwineSlaughterPigsInputSchema
>;

export type SwineSpecificClassInputTransformed =
  | SwineBoarsInputTransformed
  | SwineSowsInputTransformed
  | SwineGiltsInputTransformed
  | SwineSlaughterPigsInputTransformed;
