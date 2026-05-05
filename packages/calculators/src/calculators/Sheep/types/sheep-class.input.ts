import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  SheepClassPeriodInputSchema,
  SheepClassPeriodsInputTransformed,
  SheepClassWithLambingPeriodInputSchema,
  SheepClassWithLambingPeriodInputTransformed,
} from './sheep-class-period.input';

export const SheepClassSeasonalInputSchema = object({
  spring: SheepClassPeriodInputSchema,
  summer: SheepClassPeriodInputSchema,
  autumn: SheepClassPeriodInputSchema,
  winter: SheepClassPeriodInputSchema,
});

export type SheepClassSeasonalInputTransformed = z.output<
  typeof SheepClassSeasonalInputSchema
>;

export const SheepClassWithLambingSeasonalInputSchema = object({
  spring: SheepClassWithLambingPeriodInputSchema,
  summer: SheepClassWithLambingPeriodInputSchema,
  autumn: SheepClassWithLambingPeriodInputSchema,
  winter: SheepClassWithLambingPeriodInputSchema,
});

export type SheepClassWithLambingSeasonalInputTransformed = z.output<
  typeof SheepClassWithLambingSeasonalInputSchema
>;

export const SheepClassMonthlyInputSchema = object({
  january: SheepClassPeriodInputSchema,
  february: SheepClassPeriodInputSchema,
  march: SheepClassPeriodInputSchema,
  april: SheepClassPeriodInputSchema,
  may: SheepClassPeriodInputSchema,
  june: SheepClassPeriodInputSchema,
  july: SheepClassPeriodInputSchema,
  august: SheepClassPeriodInputSchema,
  september: SheepClassPeriodInputSchema,
  october: SheepClassPeriodInputSchema,
  november: SheepClassPeriodInputSchema,
  december: SheepClassPeriodInputSchema,
});

export const SheepClassWithLambingMonthlyInputSchema = object({
  january: SheepClassWithLambingPeriodInputSchema,
  february: SheepClassWithLambingPeriodInputSchema,
  march: SheepClassWithLambingPeriodInputSchema,
  april: SheepClassWithLambingPeriodInputSchema,
  may: SheepClassWithLambingPeriodInputSchema,
  june: SheepClassWithLambingPeriodInputSchema,
  july: SheepClassWithLambingPeriodInputSchema,
  august: SheepClassWithLambingPeriodInputSchema,
  september: SheepClassWithLambingPeriodInputSchema,
  october: SheepClassWithLambingPeriodInputSchema,
  november: SheepClassWithLambingPeriodInputSchema,
  december: SheepClassWithLambingPeriodInputSchema,
});

export const SheepClassInputSchema = z.union([
  SheepClassSeasonalInputSchema,
  SheepClassMonthlyInputSchema,
]);

export const SheepClassWithLambingInputSchema = z.union([
  SheepClassWithLambingSeasonalInputSchema,
  SheepClassWithLambingMonthlyInputSchema,
]);

export const isSheepPeriodWithLambing = (
  period: SheepClassPeriodsInputTransformed,
): period is SheepClassWithLambingPeriodInputTransformed => {
  return 'percentLambing' in period;
};

export const isSheepClassSeasonal = (
  cls: SheepClassTypesInputTransformed,
): cls is SheepClassSeasonalInputTransformed => {
  return 'spring' in cls;
};

export type SheepClassInput = z.input<typeof SheepClassInputSchema>;
export type SheepClassInputTransformed = z.output<typeof SheepClassInputSchema>;

export type SheepClassWithLambingInput = z.input<
  typeof SheepClassWithLambingInputSchema
>;
export type SheepClassWithLambingInputTransformed = z.output<
  typeof SheepClassWithLambingInputSchema
>;

export type SheepClassTypesInputTransformed =
  | SheepClassInputTransformed
  | SheepClassWithLambingInputTransformed;
export type SheepClassTypesSeasonalInputTransformed =
  | SheepClassSeasonalInputTransformed
  | SheepClassWithLambingSeasonalInputTransformed;
