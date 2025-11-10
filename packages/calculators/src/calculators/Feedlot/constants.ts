import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  feedlotConstants,
  livestockConstants,
} from '@/constants/values';

export type ConstantsForFeedlotCalculator = Pick<
  AllConstants,
  'FEEDLOT' | 'COMMON' | 'LIVESTOCK'
>;

export const constantsForFeedlotCalculator: ConstantsForFeedlotCalculator = {
  FEEDLOT: feedlotConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
