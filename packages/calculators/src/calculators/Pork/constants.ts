import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  livestockConstants,
  porkConstants,
} from '@/constants/values';

export type ConstantsForPorkCalculator = Pick<
  AllConstants,
  'PORK' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForPorkCalculator: ConstantsForPorkCalculator = {
  PORK: porkConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
