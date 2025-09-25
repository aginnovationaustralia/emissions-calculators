import { constants, deerConstants } from '../constants/constant_values';
import { Constants, DeerConstants } from '../constants/versionedConstants';

export type ConstantsForDeerCalculator = {
  DEER: DeerConstants;
  COMMON: Constants;
};

export const constantsForDeerCalculator: ConstantsForDeerCalculator = {
  DEER: deerConstants,
  COMMON: constants,
};
