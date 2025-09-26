import { Constants } from '../constants';
import { constants, cropConstants } from '../constants/constant_values';
import { CropConstants } from '../constants/versionedConstants';

export type ConstantsForHorticultureCalculator = {
  COMMON: Constants;
  CROP: CropConstants;
};

export const constantsForHorticultureCalculator: ConstantsForHorticultureCalculator =
  {
    COMMON: constants,
    CROP: cropConstants,
  };
