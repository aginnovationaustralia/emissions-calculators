import { AllConstants } from './constants/types';
import {
  commonConstants,
  cropConstants,
  swineConstants,
} from './constants/values';

export type ConstantsForGrainsCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP' | 'SWINE'
>;

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
};
