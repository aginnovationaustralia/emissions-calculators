import {
  CropType,
  CropTypes,
  ElectricityRegions,
  isBurnableCropType,
  PastureType,
  PastureTypes,
} from '@/constants/enums';
import { nv } from '@/tools/inputs';
import { createValueCheck } from './domain';

export const checkCropType = (type: string | undefined): CropType => {
  if (!CropTypes.includes(type as CropType)) {
    throw new Error(`Invalid crop type: ${type}`);
  }
  return type as CropType;
};

export const checkPastureType = (type: string | undefined): PastureType => {
  if (!PastureTypes.includes(type as PastureType)) {
    throw new Error(`Invalid pasture type: ${type}`);
  }
  return type as PastureType;
};

export const checkRegion = createValueCheck(ElectricityRegions, 'region');

/**
 * Crop type and burnt fraction for a crop residue input. The burnt fraction is
 * only accepted for crops that can be burnt, so it is dropped for other crops.
 */
export const cropTypeAndBurntFraction = (
  type: CropType,
  fractionOfAnnualCropBurnt: number,
) =>
  isBurnableCropType(type)
    ? { type, fractionOfAnnualCropBurnt: nv(fractionOfAnnualCropBurnt) }
    : { type };
