import {
  CropType,
  CropTypes,
  ElectricityRegions,
  PastureType,
  PastureTypes,
} from '@/constants/enums';
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
