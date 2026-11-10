import {
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PigsConstants,
  PoultryConstants,
  RiceConstants,
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
  riceConstants,
} from '@/constants/values';

export type ConstantsForRiceCalculator = {
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
  LIVESTOCK: LivestockConstants;
  LULUCF: LULUCFConstants;
  RICE: RiceConstants;
};

export const constantsForRiceCalculator: ConstantsForRiceCalculator = {
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  LIVESTOCK: livestockConstants,
  LULUCF: lulucfConstants,
  RICE: riceConstants,
};
