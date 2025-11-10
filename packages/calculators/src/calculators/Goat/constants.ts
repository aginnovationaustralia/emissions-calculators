import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  goatConstants,
  livestockConstants,
} from '@/constants/values';

export type ConstantsForGoatCalculator = Pick<
  AllConstants,
  'GOAT' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForGoatCalculator: ConstantsForGoatCalculator = {
  GOAT: goatConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
