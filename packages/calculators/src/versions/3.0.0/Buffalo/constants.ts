import { buffaloConstants, constants } from '../constants/constant_values';
import { BuffaloConstants, Constants } from '../constants/versionedConstants';

export type ConstantsForBuffaloCalculator = {
  BUFFALO: BuffaloConstants;
  COMMON: Constants;
};

export const constantsForBuffaloCalculator: ConstantsForBuffaloCalculator = {
  BUFFALO: buffaloConstants,
  COMMON: constants,
};
