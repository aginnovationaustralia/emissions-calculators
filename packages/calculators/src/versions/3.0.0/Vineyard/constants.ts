import { commonConstants, cropConstants } from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForVineyardCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForVineyardCalculator: ConstantsForVineyardCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
};
