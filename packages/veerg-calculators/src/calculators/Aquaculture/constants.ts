import { HasConstants } from '@/constants/types';
import {
  aquacultureConstants,
  beefPastureConstants,
  commonConstants,
  cropConstants,
  dairyConstants,
  feedlotConstants,
  livestockConstants,
  pigsConstants,
  poultryConstants,
} from '@/constants/values';

export type ConstantsForAquacultureCalculator = HasConstants<
  | 'COMMON'
  | 'AQUACULTURE'
  | 'BEEF_PASTURE'
  | 'DAIRY'
  | 'FEEDLOT'
  | 'LIVESTOCK'
  | 'CROP'
  | 'POULTRY'
  | 'PIGS'
>;

export const constantsForAquacultureCalculator: ConstantsForAquacultureCalculator =
  {
    AQUACULTURE: aquacultureConstants,
    LIVESTOCK: livestockConstants,
    DAIRY: dairyConstants,
    BEEF_PASTURE: beefPastureConstants,
    POULTRY: poultryConstants,
    COMMON: commonConstants,
    CROP: cropConstants,
    PIGS: pigsConstants,
    FEEDLOT: feedlotConstants,
  };
