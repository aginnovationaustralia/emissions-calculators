import { constants, cropConstants } from '../constants/constant_values';
import { Constants, CropConstants } from '../constants/versionedConstants';

export type ConstantsForVineyardCalculator = {
  COMMON: Constants;
  CROP: CropConstants;
};

export const constantsForVineyardCalculator: ConstantsForVineyardCalculator = {
  COMMON: constants,
  CROP: cropConstants,
};
