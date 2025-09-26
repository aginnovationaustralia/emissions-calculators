import {
  constants,
  deerConstants,
  livestockConstants,
} from '../constants/constant_values';
import {
  Constants,
  DeerConstants,
  LivestockConstants,
} from '../constants/versionedConstants';

export type ConstantsForDeerCalculator = {
  DEER: DeerConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForDeerCalculator: ConstantsForDeerCalculator = {
  DEER: deerConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
