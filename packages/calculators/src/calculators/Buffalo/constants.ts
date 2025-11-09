import {
  buffaloConstants,
  commonConstants,
  livestockConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForBuffaloCalculator = Pick<
  AllConstants,
  'BUFFALO' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForBuffaloCalculator: ConstantsForBuffaloCalculator = {
  BUFFALO: buffaloConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
