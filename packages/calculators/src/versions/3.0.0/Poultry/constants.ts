import { constants, poultryConstants } from '../constants/constant_values';
import { Constants, PoultryConstants } from '../constants/versionedConstants';

export type ConstantsForPoultryCalculator = {
  POULTRY: PoultryConstants;
  COMMON: Constants;
};

export const constantsForPoultryCalculator: ConstantsForPoultryCalculator = {
  POULTRY: poultryConstants,
  COMMON: constants,
};
