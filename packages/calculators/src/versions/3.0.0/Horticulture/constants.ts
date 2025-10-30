import { commonConstants, cropConstants } from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForHorticultureCalculator = Pick<
  AllConstants,
  'COMMON' | 'CROP'
>;

export const constantsForHorticultureCalculator: ConstantsForHorticultureCalculator =
  {
    COMMON: commonConstants,
    CROP: cropConstants,
  };
