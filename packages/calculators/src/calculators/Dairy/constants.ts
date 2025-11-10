import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  dairyConstants,
  livestockConstants,
} from '@/constants/values';

export type ConstantsForDairyCalculator = Pick<
  AllConstants,
  'DAIRY' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForDairyCalculator: ConstantsForDairyCalculator = {
  DAIRY: dairyConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
