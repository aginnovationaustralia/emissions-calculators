import { AllConstants } from '@/constants/types';
import {
  beefConstants,
  commonConstants,
  livestockConstants,
  savannaConstants,
} from '@/constants/values';

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
