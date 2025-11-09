import {
  beefConstants,
  commonConstants,
  livestockConstants,
  savannaConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForBeefCalculator = Pick<
  AllConstants,
  'BEEF' | 'COMMON' | 'SAVANNA' | 'LIVESTOCK'
>;

export const constantsForBeefCalculator: ConstantsForBeefCalculator = {
  BEEF: beefConstants,
  COMMON: commonConstants,
  SAVANNA: savannaConstants,
  LIVESTOCK: livestockConstants,
};
