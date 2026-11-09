import { HasConstants } from '@/constants/types';
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

export type ConstantsForFeedlotCalculator = HasConstants<
  | 'COMMON'
  | 'LIVESTOCK'
  | 'FEEDLOT'
  | 'LULUCF'
  | 'CROP'
  | 'BEEF_PASTURE'
  | 'DAIRY'
  | 'PIGS'
  | 'POULTRY'
  | 'SHEEP'
>;

export const constantsForFeedlotCalculator: ConstantsForFeedlotCalculator = {
  LIVESTOCK: livestockConstants,
  COMMON: commonConstants,
  FEEDLOT: feedlotConstants,
  LULUCF: lulucfConstants,
  CROP: cropConstants,
  BEEF_PASTURE: beefPastureConstants,
  DAIRY: dairyConstants,
  PIGS: pigsConstants,
  POULTRY: poultryConstants,
  SHEEP: sheepConstants,
};
