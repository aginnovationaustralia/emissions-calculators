import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  cottonConstants,
  cropConstants,
} from '@/constants/values';

export type ConstantsForCottonCalculator = Pick<
  AllConstants,
  'CROP' | 'COMMON' | 'COTTON'
>;

export const constantsForCottonCalculator: ConstantsForCottonCalculator = {
  CROP: cropConstants,
  COMMON: commonConstants,
  COTTON: cottonConstants,
};
