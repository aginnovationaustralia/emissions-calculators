import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefCalfClassPeriodInputSchema,
  BeefClassPeriodInputSchema,
  BeefClassPeriodWithCalvesInputSchema,
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
  spring: BeefClassPeriodWithCalvesInputSchema,
  summer: BeefClassPeriodWithCalvesInputSchema,
  autumn: BeefClassPeriodWithCalvesInputSchema,
  winter: BeefClassPeriodWithCalvesInputSchema,
}).meta({ id: 'BeefClassWithCalvesSeasonalInput' });
export type BeefClassWithCalvesSeasonalInput = z.input<
  typeof BeefClassWithCalvesSeasonalInputSchema
>;
export type BeefClassWithCalvesSeasonalInputTransformed = z.output<
  typeof BeefClassWithCalvesSeasonalInputSchema
>;

export const BeefCalfClassSeasonalInputSchema = object({
  spring: BeefCalfClassPeriodInputSchema,
  summer: BeefCalfClassPeriodInputSchema,
  autumn: BeefCalfClassPeriodInputSchema,
  winter: BeefCalfClassPeriodInputSchema,
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
  january: BeefClassPeriodWithCalvesInputSchema,
  february: BeefClassPeriodWithCalvesInputSchema,
  march: BeefClassPeriodWithCalvesInputSchema,
  april: BeefClassPeriodWithCalvesInputSchema,
  may: BeefClassPeriodWithCalvesInputSchema,
  june: BeefClassPeriodWithCalvesInputSchema,
  july: BeefClassPeriodWithCalvesInputSchema,
  august: BeefClassPeriodWithCalvesInputSchema,
  september: BeefClassPeriodWithCalvesInputSchema,
  october: BeefClassPeriodWithCalvesInputSchema,
  november: BeefClassPeriodWithCalvesInputSchema,
  december: BeefClassPeriodWithCalvesInputSchema,
}).meta({ id: 'BeefClassWithCalvesMonthlyInput' });
export type BeefClassWithCalvesMonthlyInput = z.input<
  typeof BeefClassWithCalvesMonthlyInputSchema
>;
export type BeefClassWithCalvesMonthlyInputTransformed = z.output<
  typeof BeefClassWithCalvesMonthlyInputSchema
>;

export const BeefCalfClassMonthlyInputSchema = object({
  january: BeefCalfClassPeriodInputSchema,
  february: BeefCalfClassPeriodInputSchema,
  march: BeefCalfClassPeriodInputSchema,
  april: BeefCalfClassPeriodInputSchema,
  may: BeefCalfClassPeriodInputSchema,
  june: BeefCalfClassPeriodInputSchema,
  july: BeefCalfClassPeriodInputSchema,
  august: BeefCalfClassPeriodInputSchema,
  september: BeefCalfClassPeriodInputSchema,
  october: BeefCalfClassPeriodInputSchema,
  november: BeefCalfClassPeriodInputSchema,
  december: BeefCalfClassPeriodInputSchema,
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
