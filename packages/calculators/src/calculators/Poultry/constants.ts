import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  livestockConstants,
  poultryConstants,
} from '@/constants/values';

export type ConstantsForPoultryCalculator = Pick<
  AllConstants,
  'POULTRY' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForPoultryCalculator: ConstantsForPoultryCalculator = {
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
