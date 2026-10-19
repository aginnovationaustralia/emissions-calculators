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

export type ConstantsForPoultryCalculator = HasConstants<
  | 'COMMON'
  | 'POULTRY'
  | 'LIVESTOCK'
  | 'PIGS'
  | 'CROP'
  | 'DAIRY'
  | 'FEEDLOT'
  | 'LULUCF'
  | 'BEEF_PASTURE'
  | 'SHEEP'
>;

export const constantsForPoultryCalculator: ConstantsForPoultryCalculator = {
  LIVESTOCK: livestockConstants,
  DAIRY: dairyConstants,
  POULTRY: poultryConstants,
  COMMON: commonConstants,
  CROP: cropConstants,
  PIGS: pigsConstants,
  FEEDLOT: feedlotConstants,
  LULUCF: lulucfConstants,
  BEEF_PASTURE: beefPastureConstants,
  SHEEP: sheepConstants,
};
