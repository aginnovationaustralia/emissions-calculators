import {
  commonConstants,
  goatConstants,
  livestockConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForGoatCalculator = Pick<
  AllConstants,
  'GOAT' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForGoatCalculator: ConstantsForGoatCalculator = {
  GOAT: goatConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
