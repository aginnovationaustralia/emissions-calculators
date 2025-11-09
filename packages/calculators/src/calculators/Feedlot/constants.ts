import {
  commonConstants,
  feedlotConstants,
  livestockConstants,
} from '@/constants/constant_values';
import { AllConstants } from '@/constants/versionedConstants';

export type ConstantsForFeedlotCalculator = Pick<
  AllConstants,
  'FEEDLOT' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForFeedlotCalculator: ConstantsForFeedlotCalculator = {
  FEEDLOT: feedlotConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
