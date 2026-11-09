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

export type ConstantsForSheepCalculator = {
  LIVESTOCK: LivestockConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  LULUCF: LULUCFConstants;
  SHEEP: SheepConstants;
  // NOTE: The scope of constants needed is pushed out because of the ability to purchase offsite manure and apply it to pasture
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  PIGS: PigsConstants;
  FEEDLOT: FeedlotConstants;
  BEEF_PASTURE: BeefPastureConstants;
};

export const constantsForSheepCalculator: ConstantsForSheepCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  SHEEP: sheepConstants,
  LULUCF: lulucfConstants,
  BEEF_PASTURE: beefPastureConstants,
};
