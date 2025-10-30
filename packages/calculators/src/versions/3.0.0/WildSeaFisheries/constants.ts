import {
  commonConstants,
  fisheriesConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForWildSeaFisheriesCalculator = Pick<
  AllConstants,
  'FISHERIES' | 'COMMON'
>;

export const constantsForWildSeaFisheriesCalculator: ConstantsForWildSeaFisheriesCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: commonConstants,
  };
