import {
  commonConstants,
  fisheriesConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForWildCatchFisheryCalculator = Pick<
  AllConstants,
  'FISHERIES' | 'COMMON'
>;

export const constantsForWildCatchFisheryCalculator: ConstantsForWildCatchFisheryCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: commonConstants,
  };
