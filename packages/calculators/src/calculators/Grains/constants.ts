import {
  CommonConstants,
  commonConstantsWithUnits,
} from './constants/strong-types';
import { CropConstants, SwineConstants } from './constants/types';
import { cropConstants, swineConstants } from './constants/values';

export type ConstantsForGrainsCalculator = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstantsWithUnits,
  CROP: cropConstants,
  SWINE: swineConstants,
};
