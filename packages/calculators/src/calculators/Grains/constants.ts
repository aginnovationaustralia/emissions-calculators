import {
  CommonConstants,
  CropConstants,
  SwineConstants,
} from './constants/types';
import {
  commonConstants,
  cropConstants,
  swineConstants,
} from './constants/values';

export type ConstantsForGrainsCalculator = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
};
