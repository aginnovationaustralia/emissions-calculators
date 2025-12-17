import { AllConstants } from '@/constants/types';
import {
  buffaloConstants,
  commonConstants,
  livestockConstants,
} from '@/constants/values';

export type ConstantsForBuffaloCalculator = Pick<
  AllConstants,
  'BUFFALO' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForBuffaloCalculator: ConstantsForBuffaloCalculator = {
  BUFFALO: buffaloConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
