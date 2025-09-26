import {
  buffaloConstants,
  constants,
  livestockConstants,
} from '../constants/constant_values';
import {
  BuffaloConstants,
  Constants,
  LivestockConstants,
} from '../constants/versionedConstants';

export type ConstantsForBuffaloCalculator = {
  BUFFALO: BuffaloConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForBuffaloCalculator: ConstantsForBuffaloCalculator = {
  BUFFALO: buffaloConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
