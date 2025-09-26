import {
  constants,
  livestockConstants,
  porkConstants,
} from '../constants/constant_values';
import {
  Constants,
  LivestockConstants,
  PorkConstants,
} from '../constants/versionedConstants';

export type ConstantsForPorkCalculator = {
  PORK: PorkConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForPorkCalculator: ConstantsForPorkCalculator = {
  PORK: porkConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
