import { HasConstants } from '@/constants/types';
import { commonConstants, livestockConstants } from '@/constants/values';

export type ConstantsForWildCatchFisheriesCalculator = HasConstants<
  'COMMON' | 'LIVESTOCK'
>;

export const constantsForWildCatchFisheriesCalculator: ConstantsForWildCatchFisheriesCalculator =
  {
    COMMON: commonConstants,
    LIVESTOCK: livestockConstants,
  };
