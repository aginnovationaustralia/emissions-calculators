import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  BeefClassPeriodInputSchema,
  createBeefClassWithCalvesMonthlyInputSchema,
  createBeefClassWithCalvesSeasonalInputSchema,
  isSeasonInputWithCalves,
} from './beef-class-period.input';

export const BeefClassSeasonalInputSchema = object({
  spring: BeefClassPeriodInputSchema,
  summer: BeefClassPeriodInputSchema,
  autumn: BeefClassPeriodInputSchema,
  winter: BeefClassPeriodInputSchema,
});

export const BeefClassWithCalvesSeasonalInputSchema = object({
  spring: createBeefClassWithCalvesSeasonalInputSchema('spring'),
  summer: createBeefClassWithCalvesSeasonalInputSchema('summer'),
  autumn: createBeefClassWithCalvesSeasonalInputSchema('autumn'),
  winter: createBeefClassWithCalvesSeasonalInputSchema('winter'),
});

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
});

export const BeefClassWithCalvesMonthlyInputSchema = object({
  january: createBeefClassWithCalvesMonthlyInputSchema('january'),
  february: createBeefClassWithCalvesMonthlyInputSchema('february'),
  march: createBeefClassWithCalvesMonthlyInputSchema('march'),
  april: createBeefClassWithCalvesMonthlyInputSchema('april'),
  may: createBeefClassWithCalvesMonthlyInputSchema('may'),
  june: createBeefClassWithCalvesMonthlyInputSchema('june'),
  july: createBeefClassWithCalvesMonthlyInputSchema('july'),
  august: createBeefClassWithCalvesMonthlyInputSchema('august'),
  september: createBeefClassWithCalvesMonthlyInputSchema('september'),
  october: createBeefClassWithCalvesMonthlyInputSchema('october'),
  november: createBeefClassWithCalvesMonthlyInputSchema('november'),
  december: createBeefClassWithCalvesMonthlyInputSchema('december'),
});

export const BeefClassInputSchema = z.union([
  BeefClassSeasonalInputSchema,
  BeefClassMonthlyInputSchema,
]);

export const BeefClassWithCalvesInputSchema = z.union([
  BeefClassWithCalvesSeasonalInputSchema,
  BeefClassWithCalvesMonthlyInputSchema,
]);

export const isBeefClassWithCalves = (
  cls: BeefClassInputTransformed | BeefClassWithCalvesInputTransformed,
): cls is BeefClassWithCalvesInputTransformed => {
  return 'spring' in cls && isSeasonInputWithCalves(cls.spring);
};

export type BeefClassInput = z.input<typeof BeefClassInputSchema>;
export type BeefClassInputTransformed = z.output<typeof BeefClassInputSchema>;

export type BeefClassWithCalvesInput = z.input<
  typeof BeefClassWithCalvesInputSchema
>;
export type BeefClassWithCalvesInputTransformed = z.output<
  typeof BeefClassWithCalvesInputSchema
>;

export type BeefClassSeasonalInputTransformed = z.output<
  typeof BeefClassSeasonalInputSchema
>;
export type BeefClassWithCalvesSeasonalInputTransformed = z.output<
  typeof BeefClassWithCalvesSeasonalInputSchema
>;

export type BeefClassTypesInputTransformed =
  | BeefClassInputTransformed
  | BeefClassWithCalvesInputTransformed;

export const isBeefClassSeasonal = (
  cls: BeefClassTypesInputTransformed,
): cls is BeefClassSeasonalInputTransformed => {
  return 'spring' in cls;
};
