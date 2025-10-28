import {
  commonConstants,
  livestockConstants,
  poultryConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForPoultryCalculator = Pick<
  AllConstants,
  'POULTRY' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForPoultryCalculator: ConstantsForPoultryCalculator = {
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
