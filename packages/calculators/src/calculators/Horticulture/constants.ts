import { AllConstants } from '@/constants/types';
import { commonConstants, cropConstants } from '@/constants/values';

export type ConstantsForHorticultureCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForHorticultureCalculator: ConstantsForHorticultureCalculator =
  {
    COMMON: commonConstants,
    CROP: cropConstants,
  };
