import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import { FertiliserInputInorganicScope1Method1Schema } from '@/modules/scope1/5-fertiliser';
import { BaseCropResidueInputSchema } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { input } from '@/tools/inputs';
import {
  FERT_INORGANIC_5_1,
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
} from '@/tools/modules';
import { z } from 'zod';

export const SugarCropResidueInputSchema = BaseCropResidueInputSchema.transform(
  (val) => ({
    ...val,
    type: input('Sugar Cane' as const, {
      name: 'Sugar Cane',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    }),
  }),
);

export type SugarCropResidueInput = z.input<typeof SugarCropResidueInputSchema>;

export const SugarFertiliserSchema =
  FertiliserInputInorganicScope1Method1Schema.omit({
    productionSystem: true,
  }).transform((val) => ({
    ...val,
    productionSystem: input('Sugar' as const, {
      name: 'Sugar production system',
      modules: [FERT_INORGANIC_5_1],
    }),
  }));

export type SugarFertiliserInput = z.input<typeof SugarFertiliserSchema>;
export const SugarCropInputSchema = BaseCroppingActivityInputSchema.safeExtend({
  crop: SugarCropResidueInputSchema,
  fertiliser: SugarFertiliserSchema,
});

export type SugarCropInput = z.input<typeof SugarCropInputSchema>;
export type SugarCropInputTransformed = z.output<typeof SugarCropInputSchema>;
