import {
  commonConstants,
  cropConstants,
  sugarConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForSugarCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP' | 'SUGAR'
>;

export const constantsForSugarCalculator: ConstantsForSugarCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
  SUGAR: sugarConstants,
};
