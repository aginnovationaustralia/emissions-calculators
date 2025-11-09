import {
  aquacultureConstants,
  commonConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForAquacultureCalculator = Pick<
  AllConstants,
  'AQUACULTURE' | 'COMMON'
>;

export const constantsForAquacultureCalculator: ConstantsForAquacultureCalculator =
  {
    AQUACULTURE: aquacultureConstants,
    COMMON: commonConstants,
  };
