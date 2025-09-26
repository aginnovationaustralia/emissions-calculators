import {
  constants,
  dairyConstants,
  livestockConstants,
} from '../constants/constant_values';
import {
  Constants,
  DairyConstants,
  LivestockConstants,
} from '../constants/versionedConstants';

export type ConstantsForDairyCalculator = {
  DAIRY: DairyConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForDairyCalculator: ConstantsForDairyCalculator = {
  DAIRY: dairyConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
