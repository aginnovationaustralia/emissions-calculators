import { constants, goatConstants } from '../constants/constant_values';
import { Constants, GoatConstants } from '../constants/versionedConstants';

export type ConstantsForGoatCalculator = {
  GOAT: GoatConstants;
  COMMON: Constants;
};

export const constantsForGoatCalculator: ConstantsForGoatCalculator = {
  GOAT: goatConstants,
  COMMON: constants,
};
