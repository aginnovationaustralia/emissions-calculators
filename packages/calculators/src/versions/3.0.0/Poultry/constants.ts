import {
  constants,
  livestockConstants,
  poultryConstants,
} from '../constants/constant_values';
import {
  Constants,
  LivestockConstants,
  PoultryConstants,
} from '../constants/versionedConstants';

export type ConstantsForPoultryCalculator = {
  POULTRY: PoultryConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForPoultryCalculator: ConstantsForPoultryCalculator = {
  POULTRY: poultryConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
