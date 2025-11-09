import {
  commonConstants,
  cropConstants,
  riceConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForRiceCalculator = Pick<
  AllConstants,
  'CROP' | 'RICE' | 'COMMON'
>;

export const constantsForRiceCalculator: ConstantsForRiceCalculator = {
  CROP: cropConstants,
  RICE: riceConstants,
  COMMON: commonConstants,
};
