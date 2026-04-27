import {
  BeefPastureConstants,
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  LivestockConstants,
  LULUCFConstants,
  PoultryConstants,
  SwineConstants,
} from '@/constants/types';
import {
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  lulucfConstants,
  poultryConstants,
  swineConstants,
} from '@/constants/values';

// REVISIT: Grains needs most of livestock anyway, for organic manure. We can probably switch back to a single AllConstants for all contexts
export type ConstantsForGrainsCalculator = {
  LIVESTOCK: LivestockConstants;
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
  FEEDLOT: FeedlotConstants;
  BEEF_PASTURE: BeefPastureConstants;
  LULUCF: LULUCFConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
  FEEDLOT: feedlotConstants,
  BEEF_PASTURE: beefPastureConstants,
  LULUCF: lulucfConstants,
};
