import { input } from '@/tools/inputs';
import { massPerHead, realNumber } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';
import {
  SheepClassPeriodInputSchema,
  SheepClassPeriodsInputTransformed,
  SheepClassWithLambingPeriodInputSchema,
  SheepClassWithLambingPeriodInputTransformed,
  SheepClassWithProportionLambsBornPeriodInputSchema,
} from './sheep-class-period.input';

const SheepClassBaseInputSchema = object({
  greasyWoolProduction: z
    .number()
    .min(0)
    .meta({
      description: 'Greasy wool production for this class',
    })
    .transform((val) => input('GWk', massPerHead('Greasy Wool', val))),
  cleanWoolYieldProportion: proportion()
    .meta({
      description: 'Proportion of greasy wool production that is clean wool',
    })
    .transform((val) => input('Yk', realNumber(val))),
});
export const SheepClassSeasonalInputSchema = SheepClassBaseInputSchema.extend({
  spring: SheepClassPeriodInputSchema,
  summer: SheepClassPeriodInputSchema,
  autumn: SheepClassPeriodInputSchema,
  winter: SheepClassPeriodInputSchema,
});

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

export type SheepClassWithProportionLambsBornSeasonalInputTransformed =
  z.output<typeof SheepClassWithProportionLambsBornSeasonalInputSchema>;

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
});

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
export const SheepClassInputSchema = z.union([
  SheepClassSeasonalInputSchema,
  SheepClassMonthlyInputSchema,
]);

export const SheepClassWithLambingInputSchema = z.union([
  SheepClassWithLambingSeasonalInputSchema,
  SheepClassWithLambingMonthlyInputSchema,
]);

export const SheepClassWithProportionLambsBornInputSchema = z.union([
  SheepClassWithProportionLambsBornSeasonalInputSchema,
  SheepClassWithProportionLambsBornMonthlyInputSchema,
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

export type SheepClassWithProportionLambsBornInput = z.input<
  typeof SheepClassWithProportionLambsBornInputSchema
>;
export type SheepClassWithProportionLambsBornInputTransformed = z.output<
  typeof SheepClassWithProportionLambsBornInputSchema
>;

export type SheepClassTypesInputTransformed =
  | SheepClassInputTransformed
  | SheepClassWithLambingInputTransformed
  | SheepClassWithProportionLambsBornInputTransformed;
export type SheepClassTypesSeasonalInputTransformed =
  | SheepClassSeasonalInputTransformed
  | SheepClassWithLambingSeasonalInputTransformed
  | SheepClassWithProportionLambsBornSeasonalInputTransformed;
