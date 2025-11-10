import { AllConstants } from '@/constants/types';
import { commonConstants, cropConstants } from '@/constants/values';

export type ConstantsForGrainsCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
};
