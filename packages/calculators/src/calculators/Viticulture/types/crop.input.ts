import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import { CropOnlyProductionSystems } from '@/constants/enums';
import { InorganicFertilisersScope1Method1InputSchema } from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
import { OrganicFertilisersInputSchema } from '@/modules/scope1/5-fertiliser/organic-fertilisers.input';
import { BaseCropResidueInputSchema } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { enumInput, input } from '@/tools/inputs';
import {
  FERT_INORGANIC_5_1,
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const ViticultureCropResidueInputSchema =
  BaseCropResidueInputSchema.transform((val) => ({
    ...val,
    type: input('Hops and grape vines' as const, {
      name: 'Crop type (hops and grape vines)',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    }),
  }));

export type ViticultureCropResidueInput = z.input<
  typeof ViticultureCropResidueInputSchema
>;

const ViticultureFertiliserInputSchema = object({
  productionSystem: enumInput(CropOnlyProductionSystems, {
    name: 'Viticulture production system',
    description: 'Production system of the Viticulture crop',
    method: '1',
    modules: [FERT_INORGANIC_5_1],
  }),
  inorganic: InorganicFertilisersScope1Method1InputSchema,
  organic: OrganicFertilisersInputSchema,
});

export const ViticultureCropInputSchema = BaseCroppingActivityInputSchema.omit({
  refrigerants: true,
}).safeExtend({
  crop: ViticultureCropResidueInputSchema,
  fertiliser: ViticultureFertiliserInputSchema,
});

export type ViticultureCropInput = z.input<typeof ViticultureCropInputSchema>;
export type ViticultureCropInputTransformed = z.output<
  typeof ViticultureCropInputSchema
>;
