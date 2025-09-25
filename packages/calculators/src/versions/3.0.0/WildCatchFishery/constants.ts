import { constants, fisheriesConstants } from '../constants/constant_values';
import { Constants, FisheriesConstants } from '../constants/versionedConstants';

export type ConstantsForWildCatchFisheryCalculator = {
  FISHERIES: FisheriesConstants;
  COMMON: Constants;
};

export const constantsForWildCatchFisheryCalculator: ConstantsForWildCatchFisheryCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: constants,
  };
