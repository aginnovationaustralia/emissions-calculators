import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  cropConstants,
  sugarConstants,
} from '@/constants/values';

export type ConstantsForSugarCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP' | 'SUGAR'
>;

export const constantsForSugarCalculator: ConstantsForSugarCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
  SUGAR: sugarConstants,
};
