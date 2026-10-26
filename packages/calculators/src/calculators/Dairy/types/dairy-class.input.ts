import {
  dairyEntericAndManureModules,
  dairyManureModules,
} from '@/modules/scope1/shared/dairy/modules';
import { isProportion, numberInput, numberInputOptional } from '@/tools/inputs';
import { LivestockLocation } from '@/tools/modules';
import {
  days,
  head,
  liveweight,
  liveweightGain,
  massPerMass,
  realNumber,
} from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const dairyClassBaseInputSchema = (location: LivestockLocation) =>
  object({
    head: numberInput(
      (val) => head(val),
      {
        name: 'Nj',
        method: '1',
        description: 'Number of animals in this class for this time period',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.gt(0),
    ),
    method2Liveweight: numberInputOptional(
      (val) => liveweight(val),
      {
        name: 'Wj',
        method: '2',
        description:
          'Method 2: supply an exact value for the liveweight for this class based on farm records',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.gt(0),
    ),
    method2LiveweightGain: numberInputOptional((val) => liveweightGain(val), {
      name: 'LWGj',
      method: '2',
      description:
        'Method 2: supply an exact value for the liveweight gain for this class based on farm records',
      modules: dairyEntericAndManureModules(location),
    }),
    method2DurationDays: numberInputOptional(
      (val) => days(val),
      {
        name: 'Dj',
        method: '2',
        description:
          'Method 2: supply an exact value for the number of days for this time period based on farm records',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.min(0),
    ),
    method2DryMatterDigestibility: numberInputOptional(
      (val) => realNumber(val),
      {
        name: 'DMDj',
        method: '2',
        description:
          'Method 2: supply an exact value for the dry matter digestibility for this class based on farm records',
        modules: dairyEntericAndManureModules(location),
      },
      (s) => s.min(0),
    ),
    method2CrudeProtein: numberInputOptional(
      (val) => massPerMass('CrudeProtein', 'DryMatter', val),
      {
        name: 'CPj',
        method: '2',
        description:
          'Method 2: supply an exact value for the crude protein content of the diet for this class based on farm records',
        modules: dairyManureModules(location),
      },
      isProportion,
    ),
  });

export const dairyClassMilkingCowsInputSchema = (location: LivestockLocation) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'milkingCows' as const,
    weanedName: 'milkingCows' as const,
    number: 1 as const,
  }));

export const dairyClassHeifersGt1InputSchema = (location: LivestockLocation) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'heifersGt1' as const,
    weanedName: 'heifersGt1' as const,
    number: 2 as const,
  }));
export const dairyClassHeifersLt1PreWeanedInputSchema = (
  location: LivestockLocation,
) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'heifersLt1' as const,
    weaned: false as const,
    weanedName: 'heifersLt1PreWeaned' as const,
    number: 3 as const,
  }));

export const dairyClassHeifersLt1WeanedInputSchema = (
  location: LivestockLocation,
) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'heifersLt1' as const,
    weaned: true as const,
    weanedName: 'heifersLt1Weaned' as const,
    number: 3 as const,
  }));

export const dairyClassBullsGt1InputSchema = (location: LivestockLocation) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'bullsGt1' as const,
    weanedName: 'bullsGt1' as const,
    number: 4 as const,
  }));
export const dairyClassBullsLt1PreWeanedInputSchema = (
  location: LivestockLocation,
) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'bullsLt1' as const,
    weaned: false as const,
    weanedName: 'bullsLt1PreWeaned' as const,
    number: 5 as const,
  }));

export const dairyClassBullsLt1WeanedInputSchema = (
  location: LivestockLocation,
) =>
  dairyClassBaseInputSchema(location).transform((val) => ({
    ...val,
    className: 'bullsLt1' as const,
    weaned: true as const,
    weanedName: 'bullsLt1Weaned' as const,
    number: 5 as const,
  }));

export type DairyClassMilkingCowsInputTransformed = z.output<
  ReturnType<typeof dairyClassMilkingCowsInputSchema>
>;
export type DairyClassHeifersGt1InputTransformed = z.output<
  ReturnType<typeof dairyClassHeifersGt1InputSchema>
>;
export type DairyClassHeifersLt1PreWeanedInputTransformed = z.output<
  ReturnType<typeof dairyClassHeifersLt1PreWeanedInputSchema>
>;
export type DairyClassHeifersLt1WeanedInputTransformed = z.output<
  ReturnType<typeof dairyClassHeifersLt1WeanedInputSchema>
>;
export type DairyClassBullsGt1InputTransformed = z.output<
  ReturnType<typeof dairyClassBullsGt1InputSchema>
>;
export type DairyClassBullsLt1PreWeanedInputTransformed = z.output<
  ReturnType<typeof dairyClassBullsLt1PreWeanedInputSchema>
>;
export type DairyClassBullsLt1WeanedInputTransformed = z.output<
  ReturnType<typeof dairyClassBullsLt1WeanedInputSchema>
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
