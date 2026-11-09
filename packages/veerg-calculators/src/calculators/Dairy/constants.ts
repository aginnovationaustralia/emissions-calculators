import {
  BeefPastureConstants,
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PigsConstants,
  PoultryConstants,
  SheepConstants,
} from '@/constants/types';
import {
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  lulucfConstants,
  pigsConstants,
  poultryConstants,
  sheepConstants,
} from '@/constants/values';

export type ConstantsForDairyCalculator = {
  LIVESTOCK: LivestockConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  DAIRY: DairyConstants;
  LULUCF: LULUCFConstants;
  // NOTE: The scope of constants needed is pushed out because of the ability to purchase offsite manure and apply it to pasture
  BEEF_PASTURE: BeefPastureConstants;
  POULTRY: PoultryConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
  SHEEP: SheepConstants;
};

export const constantsForDairyCalculator: ConstantsForDairyCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  BEEF_PASTURE: beefPastureConstants,
  LULUCF: lulucfConstants,
  SHEEP: sheepConstants,
};
