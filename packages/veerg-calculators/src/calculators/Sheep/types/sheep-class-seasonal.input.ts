import {
  SheepClassPeriodInputSchema,
  SheepClassWithLambingPeriodInputSchema,
  SheepClassWithProportionLambsBornPeriodInputSchema,
} from './sheep-class-period.input';
import { SheepClassBaseInputSchema } from './sheep-class-base.input';
import z from 'zod';

export const SheepClassSeasonalInputSchema = SheepClassBaseInputSchema.extend({
  spring: SheepClassPeriodInputSchema,
  summer: SheepClassPeriodInputSchema,
  autumn: SheepClassPeriodInputSchema,
  winter: SheepClassPeriodInputSchema,
}).meta({ id: 'SheepClassSeasonalInput' });
export type SheepClassSeasonalInput = z.input<
  typeof SheepClassSeasonalInputSchema
>;
export type SheepClassSeasonalInputTransformed = z.output<
  typeof SheepClassSeasonalInputSchema
>;

export const SheepClassWithLambingSeasonalInputSchema =
  SheepClassBaseInputSchema.extend({
    spring: SheepClassWithLambingPeriodInputSchema,
    summer: SheepClassWithLambingPeriodInputSchema,
    autumn: SheepClassWithLambingPeriodInputSchema,
    winter: SheepClassWithLambingPeriodInputSchema,
  });
export type SheepClassWithLambingSeasonalInput = z.input<
  typeof SheepClassWithLambingSeasonalInputSchema
>;
export type SheepClassWithLambingSeasonalInputTransformed = z.output<
  typeof SheepClassWithLambingSeasonalInputSchema
>;

export const SheepClassWithProportionLambsBornSeasonalInputSchema =
  SheepClassBaseInputSchema.extend({
    spring: SheepClassWithProportionLambsBornPeriodInputSchema,
    summer: SheepClassWithProportionLambsBornPeriodInputSchema,
    autumn: SheepClassWithProportionLambsBornPeriodInputSchema,
    winter: SheepClassWithProportionLambsBornPeriodInputSchema,
  });
export type SheepClassWithProportionLambsBornSeasonalInput = z.input<
  typeof SheepClassWithProportionLambsBornSeasonalInputSchema
>;
export type SheepClassWithProportionLambsBornSeasonalInputTransformed =
  z.output<typeof SheepClassWithProportionLambsBornSeasonalInputSchema>;

export type SheepClassExtendedSeasonalInput =
  | SheepClassSeasonalInput
  | SheepClassWithLambingSeasonalInput
  | SheepClassWithProportionLambsBornSeasonalInput;
export type SheepClassExtendedSeasonalInputTransformed =
  | SheepClassSeasonalInputTransformed
  | SheepClassWithLambingSeasonalInputTransformed
  | SheepClassWithProportionLambsBornSeasonalInputTransformed;
