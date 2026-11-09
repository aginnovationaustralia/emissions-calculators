import {
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PigsConstants,
  PoultryConstants,
} from '@/constants/types';
import {
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  lulucfConstants,
  pigsConstants,
  poultryConstants,
} from '@/constants/values';

export type ConstantsForSugarCalculator = {
  LIVESTOCK: LivestockConstants;
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
  LULUCF: LULUCFConstants;
};

export const constantsForSugarCalculator: ConstantsForSugarCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  LULUCF: lulucfConstants,
};
