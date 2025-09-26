import {
  beefConstants,
  constants,
  livestockConstants,
  savannaConstants,
} from '../constants/constant_values';
import {
  BeefConstants,
  Constants,
  LivestockConstants,
  SavannaConstants,
} from '../constants/versionedConstants';

export type ConstantsForBeefCalculator = {
  BEEF: BeefConstants;
  SAVANNA: SavannaConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForBeefCalculator: ConstantsForBeefCalculator = {
  BEEF: beefConstants,
  COMMON: constants,
  SAVANNA: savannaConstants,
  LIVESTOCK: livestockConstants,
};
