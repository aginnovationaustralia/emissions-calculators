import {
  constants,
  cropConstants,
  riceConstants,
} from '../constants/constant_values';
import {
  Constants,
  CropConstants,
  RiceConstants,
} from '../constants/versionedConstants';

export type ConstantsForRiceCalculator = {
  CROP: CropConstants;
  RICE: RiceConstants;
  COMMON: Constants;
};

export const constantsForRiceCalculator: ConstantsForRiceCalculator = {
  CROP: cropConstants,
  RICE: riceConstants,
  COMMON: constants,
};
