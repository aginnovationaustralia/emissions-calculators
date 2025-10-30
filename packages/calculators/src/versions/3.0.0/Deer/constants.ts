import {
  commonConstants,
  deerConstants,
  livestockConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForDeerCalculator = Pick<
  AllConstants,
  'DEER' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForDeerCalculator: ConstantsForDeerCalculator = {
  DEER: deerConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
