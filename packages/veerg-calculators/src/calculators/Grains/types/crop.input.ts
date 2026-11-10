import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import { GrainsCropTypes } from '@/constants/enums';
import { HasFertiliserInputSchema } from '@/modules/scope1/5-fertiliser/fertiliser.input';
import { BaseBurnableCropResidueInputSchema } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { enumInput } from '@/tools/inputs';
import {
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
} from '@/tools/modules';
import { z } from 'zod';

export const GrainsCropResidueInputSchema =
  BaseBurnableCropResidueInputSchema.safeExtend({
    type: enumInput(GrainsCropTypes, {
      name: 'Grains crop type',
      description: 'Type of grains crop grown in this activity',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    }),
  });

export type GrainsCropResidueInput = z.input<
  typeof GrainsCropResidueInputSchema
>;
export type GrainsCropResidueInputTransformed = z.output<
  typeof GrainsCropResidueInputSchema
>;

export const GrainsCropInputSchema = BaseCroppingActivityInputSchema.safeExtend(
  { crop: GrainsCropResidueInputSchema, ...HasFertiliserInputSchema.shape },
);

export type GrainsCropInput = z.input<typeof GrainsCropInputSchema>;
export type GrainsCropInputTransformed = z.output<typeof GrainsCropInputSchema>;
