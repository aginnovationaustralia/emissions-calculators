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

export type ConstantsForOtherLivestockCalculator = HasConstants<
  | 'COMMON'
  | 'CROP'
  | 'BEEF_PASTURE'
  | 'DAIRY'
  | 'POULTRY'
  | 'FEEDLOT'
  | 'LIVESTOCK'
  | 'PIGS'
  | 'LULUCF'
  | 'SHEEP'
>;

export const constantsForOtherLivestockCalculator: ConstantsForOtherLivestockCalculator =
  {
    COMMON: commonConstants,
    CROP: cropConstants,
    BEEF_PASTURE: beefPastureConstants,
    DAIRY: dairyConstants,
    POULTRY: poultryConstants,
    FEEDLOT: feedlotConstants,
    LIVESTOCK: livestockConstants,
    PIGS: pigsConstants,
    LULUCF: lulucfConstants,
    SHEEP: sheepConstants,
  };
