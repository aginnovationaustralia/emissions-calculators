import { AllConstants } from '@/constants/types';
import { aquacultureConstants, commonConstants } from '@/constants/values';

export type ConstantsForAquacultureCalculator = Pick<
  AllConstants,
  'AQUACULTURE' | 'COMMON'
>;

export const constantsForAquacultureCalculator: ConstantsForAquacultureCalculator =
  {
    AQUACULTURE: aquacultureConstants,
    COMMON: commonConstants,
  };
