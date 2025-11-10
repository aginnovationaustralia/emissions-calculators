import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  deerConstants,
  livestockConstants,
} from '@/constants/values';

export type ConstantsForDeerCalculator = Pick<
  AllConstants,
  'DEER' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForDeerCalculator: ConstantsForDeerCalculator = {
  DEER: deerConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
