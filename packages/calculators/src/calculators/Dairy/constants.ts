import {
  commonConstants,
  dairyConstants,
  livestockConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForDairyCalculator = Pick<
  AllConstants,
  'DAIRY' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForDairyCalculator: ConstantsForDairyCalculator = {
  DAIRY: dairyConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
