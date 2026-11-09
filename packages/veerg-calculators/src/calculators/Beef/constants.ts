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

export type ConstantsForBeefCalculator = {
  LIVESTOCK: LivestockConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  BEEF_PASTURE: BeefPastureConstants;
  LULUCF: LULUCFConstants;
  // NOTE: The scope of constants needed is pushed out because of the ability to purchase offsite manure and apply it to pasture
  DAIRY: DairyConstants;
  SHEEP: SheepConstants;
  POULTRY: PoultryConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
};

export const constantsForBeefCalculator: ConstantsForBeefCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  SHEEP: sheepConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  BEEF_PASTURE: beefPastureConstants,
  LULUCF: lulucfConstants,
};
