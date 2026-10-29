import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import {
  HorticultureBurnableCropTypes,
  HorticultureNonBurnableCropTypes,
} from '@/constants/enums';
import { FertiliserInputInorganicScope1Method1Schema } from '@/modules/scope1/5-fertiliser';
import { cropResidueInputSchemaForTypes } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { input } from '@/tools/inputs';
import {
  FERT_INORGANIC_5_1,
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
} from '@/tools/modules';
import { z } from 'zod';

export const HorticultureCropResidueInputSchema =
  cropResidueInputSchemaForTypes(
    HorticultureBurnableCropTypes,
    HorticultureNonBurnableCropTypes,
    {
      name: 'Horticulture crop type',
      description: 'Type of horticulture crop grown in this activity',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    },
  );

export const HorticultureFertiliserSchema =
  FertiliserInputInorganicScope1Method1Schema.omit({
    productionSystem: true,
  }).transform((val) => ({
    ...val,
    productionSystem: input('Horticultural crops' as const, {
      name: 'Horticultural crop production system',
      modules: [FERT_INORGANIC_5_1],
    }),
  }));

export const HorticultureCropInputSchema = BaseCroppingActivityInputSchema.omit(
  { refrigerants: true },
).safeExtend({
  crop: HorticultureCropResidueInputSchema,
  fertiliser: HorticultureFertiliserSchema,
});

export type HorticultureCropInput = z.input<typeof HorticultureCropInputSchema>;
export type HorticultureCropInputTransformed = z.output<
  typeof HorticultureCropInputSchema
>;
