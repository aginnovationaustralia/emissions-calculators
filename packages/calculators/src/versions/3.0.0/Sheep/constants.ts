import { constants, sheepConstants } from '../constants/constant_values';
import { Constants, SheepConstants } from '../constants/versionedConstants';

export type ConstantsForSheepCalculator = {
  SHEEP: SheepConstants;
  COMMON: Constants;
};

export const sheepBeefConstants: ConstantsForSheepCalculator = {
  SHEEP: sheepConstants,
  COMMON: constants,
};
