import {
  SheepClassPeriodInputSchema,
  SheepClassWithLambingPeriodInputSchema,
  SheepClassWithProportionLambsBornPeriodInputSchema,
} from './sheep-class-period.input';
import { SheepClassBaseInputSchema } from './sheep-class-base.input';
import z from 'zod';

export const SheepClassMonthlyInputSchema = SheepClassBaseInputSchema.extend({
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
}).meta({ id: 'SheepClassMonthlyInput' });
export type SheepClassMonthlyInput = z.input<
  typeof SheepClassMonthlyInputSchema
>;
export type SheepClassMonthlyInputTransformed = z.output<
  typeof SheepClassMonthlyInputSchema
>;

export const SheepClassWithLambingMonthlyInputSchema =
  SheepClassBaseInputSchema.extend({
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
export type SheepClassWithLambingMonthlyInput = z.input<
  typeof SheepClassWithLambingMonthlyInputSchema
>;
export type SheepClassWithLambingMonthlyInputTransformed = z.output<
  typeof SheepClassWithLambingMonthlyInputSchema
>;

export const SheepClassWithProportionLambsBornMonthlyInputSchema =
  SheepClassBaseInputSchema.extend({
    january: SheepClassWithProportionLambsBornPeriodInputSchema,
    february: SheepClassWithProportionLambsBornPeriodInputSchema,
    march: SheepClassWithProportionLambsBornPeriodInputSchema,
    april: SheepClassWithProportionLambsBornPeriodInputSchema,
    may: SheepClassWithProportionLambsBornPeriodInputSchema,
    june: SheepClassWithProportionLambsBornPeriodInputSchema,
    july: SheepClassWithProportionLambsBornPeriodInputSchema,
    august: SheepClassWithProportionLambsBornPeriodInputSchema,
    september: SheepClassWithProportionLambsBornPeriodInputSchema,
    october: SheepClassWithProportionLambsBornPeriodInputSchema,
    november: SheepClassWithProportionLambsBornPeriodInputSchema,
    december: SheepClassWithProportionLambsBornPeriodInputSchema,
  });
export type SheepClassWithProportionLambsBornMonthlyInput = z.input<
  typeof SheepClassWithProportionLambsBornMonthlyInputSchema
>;
export type SheepClassWithProportionLambsBornMonthlyInputTransformed = z.output<
  typeof SheepClassWithProportionLambsBornMonthlyInputSchema
>;

export type SheepClassExtendedMonthlyInput =
  | SheepClassMonthlyInput
  | SheepClassWithLambingMonthlyInput
  | SheepClassWithProportionLambsBornMonthlyInput;
export type SheepClassExtendedMonthlyInputTransformed =
  | SheepClassMonthlyInputTransformed
  | SheepClassWithLambingMonthlyInputTransformed
  | SheepClassWithProportionLambsBornMonthlyInputTransformed;
