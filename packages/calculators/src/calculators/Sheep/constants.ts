import { AllConstants } from '@/constants/types';
import {
  commonConstants,
  livestockConstants,
  sheepConstants,
} from '@/constants/values';

export type ConstantsForSheepCalculator = Pick<
  AllConstants,
  'SHEEP' | 'COMMON' | 'LIVESTOCK'
>;
export const sheepBeefConstants: ConstantsForSheepCalculator = {
  SHEEP: sheepConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};
