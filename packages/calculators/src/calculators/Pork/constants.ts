import {
  commonConstants,
  livestockConstants,
  porkConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForPorkCalculator = Pick<
  AllConstants,
  'PORK' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForPorkCalculator: ConstantsForPorkCalculator = {
  PORK: porkConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
