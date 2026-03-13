import {
  CommonConstants,
  CropConstants,
  FeedlotConstants,
  SwineConstants,
} from './constants/types';
import {
  commonConstants,
  cropConstants,
  feedlotConstants,
  swineConstants,
} from './constants/values';

export type ConstantsForGrainsCalculator = {
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
  FEEDLOT: FeedlotConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
  FEEDLOT: feedlotConstants,
};
