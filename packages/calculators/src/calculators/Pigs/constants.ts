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

export type ConstantsForPigsCalculator = HasConstants<
  | 'COMMON'
  | 'LIVESTOCK'
  | 'PIGS'
  | 'CROP'
  | 'DAIRY'
  | 'POULTRY'
  | 'FEEDLOT'
  | 'LULUCF'
  | 'BEEF_PASTURE'
  | 'SHEEP'
>;

export const constantsForPigsCalculator: ConstantsForPigsCalculator = {
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
