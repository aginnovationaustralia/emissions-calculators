import { input } from '@/tools/inputs';
import { days, head, mass, massPerHeadPerDay } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const DairyClassBaseInputSchema = object({
  head: z
    .number()
    .gt(0)
    .transform((val) => input('Nj', head(val))),
  method2Liveweight: z
    .number()
    .gt(0)
    .optional()
    .transform((val) =>
      val === undefined ? undefined : input('Wj', mass('Liveweight', val)),
    ),
  method2LiveweightGain: z
    .number()
    .optional()
    .transform((val) =>
      val === undefined
        ? undefined
        : input('LWGj', massPerHeadPerDay('Liveweight', val)),
    ),
  method2DurationDays: z
    .number()
    .optional()
    .transform((val) =>
      val === undefined ? undefined : input('Dj', days(val)),
    ),
});

export const DairyClassMilkingCowsInputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'milkingCows' as const,
    weanedName: 'milkingCows' as const,
    number: 1 as const,
  }));

export const DairyClassHeifersGt1InputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'heifersGt1' as const,
    weanedName: 'heifersGt1' as const,
    number: 2 as const,
  }));

export const DairyClassHeifersLt1PreWeanedInputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'heifersLt1' as const,
    weaned: false as const,
    weanedName: 'heifersLt1PreWeaned' as const,
    number: 3 as const,
  }));

export const DairyClassHeifersLt1WeanedInputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'heifersLt1' as const,
    weaned: true as const,
    weanedName: 'heifersLt1Weaned' as const,
    number: 3 as const,
  }));

export const DairyClassBullsGt1InputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'bullsGt1' as const,
    weanedName: 'bullsGt1' as const,
    number: 4 as const,
  }));

export const DairyClassBullsLt1PreWeanedInputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'bullsLt1' as const,
    weaned: false as const,
    weanedName: 'bullsLt1PreWeaned' as const,
    number: 5 as const,
  }));

export const DairyClassBullsLt1WeanedInputSchema =
  DairyClassBaseInputSchema.transform((val) => ({
    ...val,
    className: 'bullsLt1' as const,
    weaned: true as const,
    weanedName: 'bullsLt1Weaned' as const,
    number: 5 as const,
  }));

export type DairyClassMilkingCowsInputTransformed = z.output<
  typeof DairyClassMilkingCowsInputSchema
>;
export type DairyClassHeifersGt1InputTransformed = z.output<
  typeof DairyClassHeifersGt1InputSchema
>;
export type DairyClassHeifersLt1PreWeanedInputTransformed = z.output<
  typeof DairyClassHeifersLt1PreWeanedInputSchema
>;
export type DairyClassHeifersLt1WeanedInputTransformed = z.output<
  typeof DairyClassHeifersLt1WeanedInputSchema
>;
export type DairyClassBullsGt1InputTransformed = z.output<
  typeof DairyClassBullsGt1InputSchema
>;
export type DairyClassBullsLt1PreWeanedInputTransformed = z.output<
  typeof DairyClassBullsLt1PreWeanedInputSchema
>;
export type DairyClassBullsLt1WeanedInputTransformed = z.output<
  typeof DairyClassBullsLt1WeanedInputSchema
>;

export type DairyClassMatureInputTransformed =
  | DairyClassMilkingCowsInputTransformed
  | DairyClassHeifersGt1InputTransformed
  | DairyClassBullsGt1InputTransformed;

export type DairyClassPreWeanedInputTransformed =
  | DairyClassHeifersLt1PreWeanedInputTransformed
  | DairyClassBullsLt1PreWeanedInputTransformed;

export type DairyClassWeanedInputTransformed =
  | DairyClassHeifersLt1WeanedInputTransformed
  | DairyClassBullsLt1WeanedInputTransformed;

export type DairyClassInputTransformed =
  | DairyClassMatureInputTransformed
  | DairyClassPreWeanedInputTransformed
  | DairyClassWeanedInputTransformed;

export const isClassPreWeaned = (
  classInput: DairyClassInputTransformed,
): classInput is DairyClassPreWeanedInputTransformed => {
  return 'weaned' in classInput && classInput.weaned === false;
};

export const isClassWeaned = (
  classInput: DairyClassInputTransformed,
): classInput is DairyClassWeanedInputTransformed => {
  return 'weaned' in classInput && classInput.weaned === true;
};

export const isClassMature = (
  classInput: DairyClassInputTransformed,
): classInput is DairyClassMatureInputTransformed => {
  return !('weaned' in classInput);
};
