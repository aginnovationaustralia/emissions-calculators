import {
  beefConstants,
  constants,
  savannaConstants,
} from '../constants/constant_values';
import {
  BeefConstants,
  Constants,
  SavannaConstants,
} from '../constants/versionedConstants';

export type ConstantsForBeefCalculator = {
  BEEF: BeefConstants;
  SAVANNA: SavannaConstants;
  COMMON: Constants;
};

export const constantsForBeefCalculator: ConstantsForBeefCalculator = {
  BEEF: beefConstants,
  COMMON: constants,
  SAVANNA: savannaConstants,
};
