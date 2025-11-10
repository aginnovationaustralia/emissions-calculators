import { AllConstants } from '@/constants/types';
import { commonConstants, fisheriesConstants } from '@/constants/values';

export type ConstantsForWildSeaFisheriesCalculator = Pick<
  AllConstants,
  'FISHERIES' | 'COMMON'
>;

export const constantsForWildSeaFisheriesCalculator: ConstantsForWildSeaFisheriesCalculator =
  {
    FISHERIES: fisheriesConstants,
    COMMON: commonConstants,
  };
