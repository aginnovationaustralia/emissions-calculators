import {
  BaseCroppingActivityInput,
  BaseCroppingActivityInputSchema,
  BaseCroppingActivityInputTransformed,
} from '@/calculators/types/cropping-activity.input';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser/fertiliser.input';
import {
  CropResidueInputSchema,
  HasCropResidueInput,
  HasCropResidueInputTransformed,
  HasPastureWithPercentageSoldInput,
  HasPastureWithPercentageSoldInputTransformed,
  PastureWithAmountSoldInputSchema,
} from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import { z } from 'zod';

export type CropWithCropResidueInput = BaseCroppingActivityInput &
  HasFertiliserInput &
  HasCropResidueInput;
export type CropWithCropResidueInputTransformed =
  BaseCroppingActivityInputTransformed &
    HasFertiliserInputTransformed &
    HasCropResidueInputTransformed;

const CropWithCropResidueSchema: z.ZodType<
  CropWithCropResidueInputTransformed,
  CropWithCropResidueInput
> = BaseCroppingActivityInputSchema.safeExtend({
  crop: CropResidueInputSchema,
  ...HasFertiliserInputSchema.shape,
}).meta({ title: 'Crop' });

export type CropWithPastureResidueInput = BaseCroppingActivityInput &
  HasFertiliserInput &
  HasPastureWithPercentageSoldInput;
export type CropWithPastureResidueInputTransformed =
  BaseCroppingActivityInputTransformed &
    HasFertiliserInputTransformed &
    HasPastureWithPercentageSoldInputTransformed;

const CroppingCropWithPastureResidueSchema: z.ZodType<
  CropWithPastureResidueInputTransformed,
  CropWithPastureResidueInput
> = BaseCroppingActivityInputSchema.safeExtend({
  pasture: PastureWithAmountSoldInputSchema,
  ...HasFertiliserInputSchema.shape,
}).meta({ title: 'Pasture' });

// A crop activity can either be pasture or cropping, but not both
export type CroppingCropInput =
  CropWithCropResidueInput | CropWithPastureResidueInput;
export type CroppingCropInputTransformed =
  CropWithCropResidueInputTransformed | CropWithPastureResidueInputTransformed;

export const CroppingCropSchema: z.ZodType<
  CroppingCropInputTransformed,
  CroppingCropInput
> = z.xor([CropWithCropResidueSchema, CroppingCropWithPastureResidueSchema]);
