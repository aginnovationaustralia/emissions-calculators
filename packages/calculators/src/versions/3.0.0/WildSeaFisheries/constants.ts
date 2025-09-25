import { constants, fisheriesConstants } from '../constants/constant_values';
import { Constants, FisheriesConstants } from '../constants/versionedConstants';

export type ConstantsForWildSeaFisheriesCalculator = {
  FISHERIES: FisheriesConstants;
  COMMON: Constants;
};

export const constantsForWildSeaFisheriesCalculator: ConstantsForWildSeaFisheriesCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: constants,
  };
