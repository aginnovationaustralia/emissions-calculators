import {
  constants,
  cottonConstants,
  cropConstants,
} from '../constants/constant_values';
import {
  Constants,
  CottonConstants,
  CropConstants,
} from '../constants/versionedConstants';

export type ConstantsForCottonCalculator = {
  CROP: CropConstants;
  COMMON: Constants;
  COTTON: CottonConstants;
};

export const constantsForCottonCalculator: ConstantsForCottonCalculator = {
  CROP: cropConstants,
  COMMON: constants,
  COTTON: cottonConstants,
};
