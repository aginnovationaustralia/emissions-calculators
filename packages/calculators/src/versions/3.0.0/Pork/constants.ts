import { constants, porkConstants } from '../constants/constant_values';
import { Constants, PorkConstants } from '../constants/versionedConstants';

export type ConstantsForPorkCalculator = {
  PORK: PorkConstants;
  COMMON: Constants;
};

export const constantsForPorkCalculator: ConstantsForPorkCalculator = {
  PORK: porkConstants,
  COMMON: constants,
};
