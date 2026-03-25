import {
  CommonConstants,
  CropConstants,
  DairyConstants,
  FeedlotConstants,
  PoultryConstants,
  SwineConstants,
} from '@/constants/types';
import {
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  poultryConstants,
  swineConstants,
} from '@/constants/values';

// REVISIT: Grains needs most of livestock anyway, for organic manure. We can probably switch back to a single AllConstants for all contexts
export type ConstantsForGrainsCalculator = {
  DAIRY: DairyConstants;
  POULTRY: PoultryConstants;
  COMMON: CommonConstants;
  CROP: CropConstants;
  SWINE: SwineConstants;
  FEEDLOT: FeedlotConstants;
};

export const constantsForGrainsCalculator: ConstantsForGrainsCalculator = {
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  SWINE: swineConstants,
  FEEDLOT: feedlotConstants,
};
