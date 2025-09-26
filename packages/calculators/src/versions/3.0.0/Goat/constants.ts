import {
  constants,
  goatConstants,
  livestockConstants,
} from '../constants/constant_values';
import {
  Constants,
  GoatConstants,
  LivestockConstants,
} from '../constants/versionedConstants';

export type ConstantsForGoatCalculator = {
  GOAT: GoatConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForGoatCalculator: ConstantsForGoatCalculator = {
  GOAT: goatConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
