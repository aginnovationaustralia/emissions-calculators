import {
  BeefPastureConstants,
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  PoultryConstants,
  RiceConstants,
  SwineConstants,
} from '@/constants/types';
import {
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  poultryConstants,
  riceConstants,
  swineConstants,
} from '@/constants/values';

export type ConstantsForRiceCalculator = {
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
  FEEDLOT: FeedlotConstants;
  BEEF_PASTURE: BeefPastureConstants;
  RICE: RiceConstants;
};

export const constantsForRiceCalculator: ConstantsForRiceCalculator = {
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
  FEEDLOT: feedlotConstants,
  BEEF_PASTURE: beefPastureConstants,
  RICE: riceConstants,
};
