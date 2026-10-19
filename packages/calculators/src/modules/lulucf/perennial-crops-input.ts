import {
  PerennialWoodyCropsFull,
  PerennialWoodyCropsPartial,
} from '@/constants/enums';
import { lulucfConstants } from '@/constants/values';
import { enumInput, numberInput, numberInputOptional } from '@/tools/inputs';
import {
  perHectareToPerSqMetre,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { countPerArea, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';

import { PERENNIAL_16_6 } from '@/tools/modules';
import { z } from 'zod';
import {
  PerennialCropClearingMethod1InputSchema,
  PerennialCropClearingMethod2InputSchema,
} from './perennial-crop-clearing-input';
import { PerennialCropPlantingInputSchema } from './perennial-crop-planting-input';

const PerennialCropBaseSchema = object({
  method2ActualStemDensity: numberInputOptional(
    (value) => countPerArea('Trees', perHectareToPerSqMetre(value)),
    {
      name: 'Actual stem density',
      method: '2',
      description:
        'Method 2: supply an exact value for the actual stem density of this planting based on farm records',
      modules: [PERENNIAL_16_6],
    },
  ),
  method2BiomassAtMaturity: numberInputOptional(
    (value) =>
      massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(value)),
    {
      name: 'Biomass at maturity',
      method: '2',
      description:
        'Method 2: supply an exact value for the biomass at maturity for this planting based on farm records',
      modules: [PERENNIAL_16_6],
    },
  ),
  plantings: z.array(PerennialCropPlantingInputSchema),
});

/** xor (not a combined enum) so cropType is Container<Full> | Container<Partial> for type guards. */
export const PerennialCropMethod1InputSchema =
  PerennialCropBaseSchema.safeExtend({
    cropType: z.xor([
      enumInput(PerennialWoodyCropsFull, {
        name: 'Crop type',
        description: 'Type of perennial woody crop planted',
        modules: [PERENNIAL_16_6],
      }).meta({
        title: 'Full',
      }),
      enumInput(PerennialWoodyCropsPartial, {
        name: 'Crop type',
        description: 'Type of perennial woody crop planted',
        modules: [PERENNIAL_16_6],
      }).meta({
        title: 'Partial',
      }),
    ]),
    clearings: z.array(PerennialCropClearingMethod1InputSchema),
    calculationMethod: z.literal('1'),
  }).meta({ title: 'Method 1' });

export type PerennialCropMethod1Input = z.input<
  typeof PerennialCropMethod1InputSchema
>;
export type PerennialCropMethod1InputTransformed = z.output<
  typeof PerennialCropMethod1InputSchema
>;

export const PerennialCropFullMethod2StemDensityInputSchema =
  PerennialCropBaseSchema.safeExtend({
    cropType: enumInput(PerennialWoodyCropsFull, {
      name: 'Crop type',
      description: 'Type of perennial woody crop planted',
      modules: [PERENNIAL_16_6],
    }),
    calculationMethod: z.literal('2 (stem density)'),
    method2ActualStemDensity: numberInput(
      (value) => countPerArea('Trees', perHectareToPerSqMetre(value)),
      {
        name: 'Actual stem density',
        method: '2',
        description:
          'Method 2: supply an exact value for the actual stem density of this planting based on farm records',
        modules: [PERENNIAL_16_6],
      },
    ),
    clearings: z.array(PerennialCropClearingMethod2InputSchema),
  })
    .superRefine((data, ctx) => {
      if (data.clearings.length === 0) {
        return;
      }

      const cropType = data.cropType.unit;
      const mc = lulucfConstants.WOODY_PERENNIAL_CROPS_FULL[cropType].Mc;

      data.clearings.forEach((clearing, index) => {
        if (clearing.method2AgeAtClearing.unit.store.value.gt(mc.store.value)) {
          ctx.addIssue({
            code: 'custom',
            message: `Age at clearing must be less than or equal to the maturity age for this crop type (${cropType})`,
            path: ['clearings', index, 'method2AgeAtClearing'],
          });
        }
      });
    })
    .meta({ title: 'Method 2 (stem density)' });

export type PerennialCropFullMethod2StemDensityInput = z.input<
  typeof PerennialCropFullMethod2StemDensityInputSchema
>;
export type PerennialCropFullMethod2StemDensityInputTransformed = z.output<
  typeof PerennialCropFullMethod2StemDensityInputSchema
>;

export const PerennialCropFullMethod2BAMInputSchema =
  PerennialCropBaseSchema.safeExtend({
    cropType: enumInput(PerennialWoodyCropsFull, {
      name: 'Crop type',
      description: 'Type of perennial woody crop planted',
      modules: [PERENNIAL_16_6],
    }),
    clearings: z.array(PerennialCropClearingMethod1InputSchema),
    calculationMethod: z.literal('2 (BAM)'),
    method2BiomassAtMaturity: numberInput(
      (value) =>
        massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(value)),
      {
        name: 'Biomass at maturity',
        method: '2',
        description:
          'Method 2: supply an exact value for the biomass at maturity for this planting based on farm records',
        modules: [PERENNIAL_16_6],
      },
    ),
  }).meta({ title: 'Method 2 (biomass at maturity)' });

export type PerennialCropFullMethod2BAMInput = z.input<
  typeof PerennialCropFullMethod2BAMInputSchema
>;
export type PerennialCropFullMethod2BAMInputTransformed = z.output<
  typeof PerennialCropFullMethod2BAMInputSchema
>;

/** Either method-2 variant (stem density or BAM). Mixing these within a method-2 list is allowed. */
export const PerennialCropMethod2InputSchema = z.discriminatedUnion(
  'calculationMethod',
  [
    PerennialCropFullMethod2StemDensityInputSchema,
    PerennialCropFullMethod2BAMInputSchema,
  ],
);

export type PerennialCropMethod2Input = z.input<
  typeof PerennialCropMethod2InputSchema
>;
export type PerennialCropMethod2InputTransformed = z.output<
  typeof PerennialCropMethod2InputSchema
>;

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

/**
 * All items must be method 1, or all items must be method 2 (stem density and/or BAM).
 * Mixing method 1 with method 2 in the same list is rejected.
 *
 * Prefer this over `z.array(method1).or(z.array(method2))`: that types as `A[] | B[]`,
 * which TypeScript rejects for common constructions like `[crop]` where crop is `A | B`.
 */
export const PerennialCropsInputSchema = z
  .array(PerennialCropInputSchema)
  .superRefine((crops, ctx) => {
    if (crops.length <= 1) {
      return;
    }

    const firstIsMethod1 = crops[0].calculationMethod === '1';

    for (let i = 1; i < crops.length; i++) {
      const itemIsMethod1 = crops[i].calculationMethod === '1';
      if (itemIsMethod1 !== firstIsMethod1) {
        ctx.addIssue({
          code: 'custom',
          message:
            'All perennial crops must use either method 1 or method 2; mixing calculation methods is not allowed',
          path: [i, 'calculationMethod'],
        });
      }
    }
  })
  .meta({ id: 'PerennialCropsInput' });

export type PerennialCropsInput = z.input<typeof PerennialCropsInputSchema>;
export type PerennialCropsInputTransformed = z.output<
  typeof PerennialCropsInputSchema
>;
