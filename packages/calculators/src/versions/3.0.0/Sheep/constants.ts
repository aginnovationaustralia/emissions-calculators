import {
  commonConstants,
  livestockConstants,
  sheepConstants,
} from '../constants/constant_values';
import { AllConstants } from '../constants/versionedConstants';

export type ConstantsForSheepCalculator = Pick<
  AllConstants,
  'SHEEP' | 'COMMON' | 'LIVESTOCK'
>;
export const sheepBeefConstants: ConstantsForSheepCalculator = {
  SHEEP: sheepConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
