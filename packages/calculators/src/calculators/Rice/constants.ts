import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  cropConstants,
  riceConstants,
} from '@/constants/values';

export type ConstantsForRiceCalculator = Pick<
  AllConstants,
  'CROP' | 'RICE' | 'COMMON'
>;

export const constantsForRiceCalculator: ConstantsForRiceCalculator = {
  CROP: cropConstants,
  RICE: riceConstants,
  COMMON: commonConstants,
};
