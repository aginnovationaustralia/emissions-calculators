import { commonConstants, cropConstants } from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForGrainsCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
};
