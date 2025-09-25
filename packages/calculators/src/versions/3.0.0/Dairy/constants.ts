import { constants, dairyConstants } from '../constants/constant_values';
import { Constants, DairyConstants } from '../constants/versionedConstants';

export type ConstantsForDairyCalculator = {
  DAIRY: DairyConstants;
  COMMON: Constants;
};

export const constantsForDairyCalculator: ConstantsForDairyCalculator = {
  DAIRY: dairyConstants,
  COMMON: constants,
};
