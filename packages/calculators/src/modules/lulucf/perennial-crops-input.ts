import {
  PerennialWoodyCrops,
  PerennialWoodyCropsFull,
} from '@/constants/enums';
import { lulucfConstants } from '@/constants/values';
import { input } from '@/tools/inputs';
import {
  perHectareToPerSqMetre,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { countPerArea, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  PerennialCropClearingMethod1InputSchema,
  PerennialCropClearingMethod2InputSchema,
} from './perennial-crop-clearing-input';
import { PerennialCropPlantingInputSchema } from './perennial-crop-planting-input';

export const PerennialCropFullBaseInputSchema = object({
  cropType: z.enum(PerennialWoodyCropsFull),
  method2ActualStemDensity: z
    .number()
    .optional()
    .transform((value) =>
      value === undefined
        ? undefined
        : input(
            'Actual stem density',
            countPerArea('Trees', perHectareToPerSqMetre(value)),
          ),
    ),
  method2BiomassAtMaturity: z
    .number()
    .optional()
    .transform((value) =>
      value === undefined
        ? undefined
        : input(
            'Biomass at maturity',
            massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(value)),
          ),
    ),
  plantings: z.array(PerennialCropPlantingInputSchema),
});

export const PerennialCropMethod1InputSchema =
  PerennialCropFullBaseInputSchema.extend({
    cropType: z.enum(PerennialWoodyCrops),
    clearings: z.array(PerennialCropClearingMethod1InputSchema),
    calculationMethod: z.literal('1'),
  });

export const PerennialCropFullMethod2StemDensityInputSchema =
  PerennialCropFullBaseInputSchema.extend({
    calculationMethod: z.literal('2 (stem density)'),
    method2ActualStemDensity: z
      .number()
      .transform((value) =>
        input(
          'Actual stem density',
          countPerArea('Trees', perHectareToPerSqMetre(value)),
        ),
      ),
    clearings: z.array(PerennialCropClearingMethod2InputSchema),
  }).superRefine((data, ctx) => {
    if (data.clearings.length > 0) {
      const cropType = data.cropType;

      const mc = lulucfConstants.WOODY_PERENNIAL_CROPS_FULL[cropType].Mc;

      data.clearings.forEach((clearing) => {
        if (clearing.method2AgeAtClearing.unit.value.gt(mc.value)) {
          ctx.addIssue({
            code: 'custom',
            message: `Age at clearing must be less than or equal to the maturity age for this crop type (${mc})`,
          });
        }
      });
    }
  });

export const PerennialCropFullMethod2BAMInputSchema =
  PerennialCropFullBaseInputSchema.extend({
    clearings: z.array(PerennialCropClearingMethod1InputSchema),
    calculationMethod: z.literal('2 (BAM)'),
    method2BiomassAtMaturity: z
      .number()
      .transform((value) =>
        input(
          'Biomass at maturity',
          massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(value)),
        ),
      ),
  });

export const PerennialCropInputSchema = z.discriminatedUnion(
  'calculationMethod',
  [
    PerennialCropMethod1InputSchema,
    PerennialCropFullMethod2StemDensityInputSchema,
    PerennialCropFullMethod2BAMInputSchema,
  ],
);

export type PerennialCropInput = z.input<typeof PerennialCropInputSchema>;
export type PerennialCropInputTransformed = z.output<
  typeof PerennialCropInputSchema
>;

export type PerennialCropMethod1Input = z.input<
  typeof PerennialCropMethod1InputSchema
>;
export type PerennialCropMethod1InputTransformed = z.output<
  typeof PerennialCropMethod1InputSchema
>;

export type PerennialCropFullMethod2StemDensityInput = z.input<
  typeof PerennialCropFullMethod2StemDensityInputSchema
>;
export type PerennialCropFullMethod2StemDensityInputTransformed = z.output<
  typeof PerennialCropFullMethod2StemDensityInputSchema
>;

export type PerennialCropFullMethod2BAMInput = z.input<
  typeof PerennialCropFullMethod2BAMInputSchema
>;
export type PerennialCropFullMethod2BAMInputTransformed = z.output<
  typeof PerennialCropFullMethod2BAMInputSchema
>;

export const isPerennialCropCalculationMethod1 = (
  crop: PerennialCropInputTransformed,
): crop is PerennialCropMethod1InputTransformed => {
  return crop.calculationMethod === '1';
};

export const isPerennialCropCalculationMethod2StemDensity = (
  crop: PerennialCropInputTransformed,
): crop is PerennialCropFullMethod2StemDensityInputTransformed => {
  return crop.calculationMethod === '2 (stem density)';
};
