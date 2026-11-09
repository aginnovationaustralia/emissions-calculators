import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefClassPeriodInputSchema,
  createBeefCalfClassMonthlyPeriodInputSchema,
  createBeefCalfClassSeasonalPeriodWithInputSchema,
  createBeefClassMonthlyPeriodWithCalvesInputSchema,
  createBeefClassSeasonalPeriodWithCalvesInputSchema,
} from './beef-class-period.input';

// Seasonal schemas
export const BeefClassSeasonalInputSchema = object({
  spring: BeefClassPeriodInputSchema,
  summer: BeefClassPeriodInputSchema,
  autumn: BeefClassPeriodInputSchema,
  winter: BeefClassPeriodInputSchema,
}).meta({ id: 'BeefClassSeasonalInput' });
export type BeefClassSeasonalInput = z.input<
  typeof BeefClassSeasonalInputSchema
>;
export type BeefClassSeasonalInputTransformed = z.output<
  typeof BeefClassSeasonalInputSchema
>;

export const BeefClassWithCalvesSeasonalInputSchema = object({
  spring: createBeefClassSeasonalPeriodWithCalvesInputSchema('spring'),
  summer: createBeefClassSeasonalPeriodWithCalvesInputSchema('summer'),
  autumn: createBeefClassSeasonalPeriodWithCalvesInputSchema('autumn'),
  winter: createBeefClassSeasonalPeriodWithCalvesInputSchema('winter'),
}).meta({ id: 'BeefClassWithCalvesSeasonalInput' });
export type BeefClassWithCalvesSeasonalInput = z.input<
  typeof BeefClassWithCalvesSeasonalInputSchema
>;
export type BeefClassWithCalvesSeasonalInputTransformed = z.output<
  typeof BeefClassWithCalvesSeasonalInputSchema
>;

export const BeefCalfClassSeasonalInputSchema = object({
  spring: createBeefCalfClassSeasonalPeriodWithInputSchema('spring'),
  summer: createBeefCalfClassSeasonalPeriodWithInputSchema('summer'),
  autumn: createBeefCalfClassSeasonalPeriodWithInputSchema('autumn'),
  winter: createBeefCalfClassSeasonalPeriodWithInputSchema('winter'),
});
export type BeefCalfClassSeasonalInput = z.input<
  typeof BeefCalfClassSeasonalInputSchema
>;
export type BeefCalfClassSeasonalInputTransformed = z.output<
  typeof BeefCalfClassSeasonalInputSchema
>;

export type BeefClassExtendedSeasonalInput =
  | BeefClassWithCalvesSeasonalInput
  | BeefCalfClassSeasonalInput
  | BeefClassSeasonalInput;
export type BeefClassExtendedSeasonalInputTransformed =
  | BeefClassWithCalvesSeasonalInputTransformed
  | BeefCalfClassSeasonalInputTransformed
  | BeefClassSeasonalInputTransformed;

// Monthly schemas
export const BeefClassMonthlyInputSchema = object({
  january: BeefClassPeriodInputSchema,
  february: BeefClassPeriodInputSchema,
  march: BeefClassPeriodInputSchema,
  april: BeefClassPeriodInputSchema,
  may: BeefClassPeriodInputSchema,
  june: BeefClassPeriodInputSchema,
  july: BeefClassPeriodInputSchema,
  august: BeefClassPeriodInputSchema,
  september: BeefClassPeriodInputSchema,
  october: BeefClassPeriodInputSchema,
  november: BeefClassPeriodInputSchema,
  december: BeefClassPeriodInputSchema,
}).meta({ id: 'BeefClassMonthlyInput' });
export type BeefClassMonthlyInput = z.input<typeof BeefClassMonthlyInputSchema>;
export type BeefClassMonthlyInputTransformed = z.output<
  typeof BeefClassMonthlyInputSchema
>;

export const BeefClassWithCalvesMonthlyInputSchema = object({
  january: createBeefClassMonthlyPeriodWithCalvesInputSchema('january'),
  february: createBeefClassMonthlyPeriodWithCalvesInputSchema('february'),
  march: createBeefClassMonthlyPeriodWithCalvesInputSchema('march'),
  april: createBeefClassMonthlyPeriodWithCalvesInputSchema('april'),
  may: createBeefClassMonthlyPeriodWithCalvesInputSchema('may'),
  june: createBeefClassMonthlyPeriodWithCalvesInputSchema('june'),
  july: createBeefClassMonthlyPeriodWithCalvesInputSchema('july'),
  august: createBeefClassMonthlyPeriodWithCalvesInputSchema('august'),
  september: createBeefClassMonthlyPeriodWithCalvesInputSchema('september'),
  october: createBeefClassMonthlyPeriodWithCalvesInputSchema('october'),
  november: createBeefClassMonthlyPeriodWithCalvesInputSchema('november'),
  december: createBeefClassMonthlyPeriodWithCalvesInputSchema('december'),
}).meta({ id: 'BeefClassWithCalvesMonthlyInput' });
export type BeefClassWithCalvesMonthlyInput = z.input<
  typeof BeefClassWithCalvesMonthlyInputSchema
>;
export type BeefClassWithCalvesMonthlyInputTransformed = z.output<
  typeof BeefClassWithCalvesMonthlyInputSchema
>;

export const BeefCalfClassMonthlyInputSchema = object({
  january: createBeefCalfClassMonthlyPeriodInputSchema('january'),
  february: createBeefCalfClassMonthlyPeriodInputSchema('february'),
  march: createBeefCalfClassMonthlyPeriodInputSchema('march'),
  april: createBeefCalfClassMonthlyPeriodInputSchema('april'),
  may: createBeefCalfClassMonthlyPeriodInputSchema('may'),
  june: createBeefCalfClassMonthlyPeriodInputSchema('june'),
  july: createBeefCalfClassMonthlyPeriodInputSchema('july'),
  august: createBeefCalfClassMonthlyPeriodInputSchema('august'),
  september: createBeefCalfClassMonthlyPeriodInputSchema('september'),
  october: createBeefCalfClassMonthlyPeriodInputSchema('october'),
  november: createBeefCalfClassMonthlyPeriodInputSchema('november'),
  december: createBeefCalfClassMonthlyPeriodInputSchema('december'),
});
export type BeefCalfClassMonthlyInput = z.input<
  typeof BeefCalfClassMonthlyInputSchema
>;
export type BeefCalfClassMonthlyInputTransformed = z.output<
  typeof BeefCalfClassMonthlyInputSchema
>;

// Combined

export type BeefClassExtendedMonthlyInput =
  | BeefClassWithCalvesMonthlyInput
  | BeefCalfClassMonthlyInput
  | BeefClassMonthlyInput;
export type BeefClassExtendedMonthlyInputTransformed =
  | BeefClassWithCalvesMonthlyInputTransformed
  | BeefCalfClassMonthlyInputTransformed
  | BeefClassMonthlyInputTransformed;

export type BeefClassInput =
  BeefClassExtendedMonthlyInput | BeefClassExtendedSeasonalInput;
export type BeefClassInputTransformed =
  | BeefClassExtendedMonthlyInputTransformed
  | BeefClassExtendedSeasonalInputTransformed;

export type BeefClassWithCalvesInput =
  BeefClassWithCalvesMonthlyInput | BeefClassWithCalvesSeasonalInput;
export type BeefClassWithCalvesInputTransformed =
  | BeefClassWithCalvesMonthlyInputTransformed
  | BeefClassWithCalvesSeasonalInputTransformed;

export type BeefCalfClassInput =
  BeefCalfClassMonthlyInput | BeefCalfClassSeasonalInput;
export type BeefCalfClassInputTransformed =
  BeefCalfClassMonthlyInputTransformed | BeefCalfClassSeasonalInputTransformed;

export const isBeefClassSeasonal = (
  cls: BeefClassInputTransformed,
): cls is BeefClassExtendedSeasonalInputTransformed => {
  return 'spring' in cls;
};
