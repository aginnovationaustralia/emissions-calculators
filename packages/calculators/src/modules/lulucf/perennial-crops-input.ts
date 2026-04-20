import {
  PerennialWoodyCropFull,
  PerennialWoodyCropPartial,
  PerennialWoodyCropsFull,
  PerennialWoodyCropsPartial,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import {
  perHectareToPerSqMetre,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { countPerArea, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import {
  PerennialCropPlantingFullInputSchema,
  PerennialCropPlantingPartialInputSchema,
} from './perennial-crop-planting-input';

export const PerennialCropFullInputSchema = object({
  cropType: z.enum(PerennialWoodyCropsFull),
  plantings: z.array(PerennialCropPlantingFullInputSchema),
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
});

export const PerennialCropPartialInputSchema = object({
  cropType: z.enum(PerennialWoodyCropsPartial),
  plantings: z.array(PerennialCropPlantingPartialInputSchema),
});

export const PerennialCropInputSchema = z.discriminatedUnion('cropType', [
  PerennialCropFullInputSchema,
  PerennialCropPartialInputSchema,
]);

export type PerennialCropInput = z.input<typeof PerennialCropInputSchema>;
export type PerennialCropInputTransformed = z.output<
  typeof PerennialCropInputSchema
>;

export type PerennialCropFullInput = z.input<
  typeof PerennialCropFullInputSchema
>;
export type PerennialCropFullInputTransformed = z.output<
  typeof PerennialCropFullInputSchema
>;

export type PerennialCropPartialInput = z.input<
  typeof PerennialCropPartialInputSchema
>;
export type PerennialCropPartialInputTransformed = z.output<
  typeof PerennialCropPartialInputSchema
>;

export const isPerennialCropInputFull = (
  crop: PerennialCropInputTransformed,
): crop is PerennialCropFullInputTransformed => {
  return PerennialWoodyCropsFull.includes(
    crop.cropType as PerennialWoodyCropFull,
  );
};

export const isPerennialCropInputPartial = (
  crop: PerennialCropInputTransformed,
): crop is PerennialCropPartialInputTransformed => {
  return PerennialWoodyCropsPartial.includes(
    crop.cropType as PerennialWoodyCropPartial,
  );
};
