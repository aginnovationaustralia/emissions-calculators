import { constants, Constants } from '../constants';
import { cropConstants, sugarConstants } from '../constants/constant_values';
import { CropConstants, SugarConstants } from '../constants/versionedConstants';

export type ConstantsForSugarCalculator = {
  COMMON: Constants;
  CROP: CropConstants;
  SUGAR: SugarConstants;
};

export const constantsForSugarCalculator: ConstantsForSugarCalculator = {
  COMMON: constants,
  CROP: cropConstants,
  SUGAR: sugarConstants,
};
