import {
  commonConstants,
  cottonConstants,
  cropConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForCottonCalculator = Pick<
  AllConstants,
  'CROP' | 'COMMON' | 'COTTON'
>;

export const constantsForCottonCalculator: ConstantsForCottonCalculator = {
  CROP: cropConstants,
  COMMON: commonConstants,
  COTTON: cottonConstants,
};
