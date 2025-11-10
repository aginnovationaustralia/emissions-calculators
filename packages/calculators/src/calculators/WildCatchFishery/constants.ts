import { AllConstants } from '@/constants/types';
import { commonConstants, fisheriesConstants } from '@/constants/values';

export type ConstantsForWildCatchFisheryCalculator = Pick<
  AllConstants,
  'FISHERIES' | 'COMMON'
>;

export const constantsForWildCatchFisheryCalculator: ConstantsForWildCatchFisheryCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: commonConstants,
  };
