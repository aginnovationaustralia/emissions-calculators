import { constants, cropConstants } from '../constants/constant_values';
import { Constants, CropConstants } from '../constants/versionedConstants';

export type ConstantsForGrainsCalculator = {
  COMMON: Constants;
  CROP: CropConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: constants,
  CROP: cropConstants,
};
