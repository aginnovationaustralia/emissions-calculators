import { AllConstants } from '@/constants/types';
import { commonConstants, cropConstants } from '@/constants/values';

export type ConstantsForVineyardCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForVineyardCalculator: ConstantsForVineyardCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
};
