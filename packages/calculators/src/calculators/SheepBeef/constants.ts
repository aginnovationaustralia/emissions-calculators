import { CommonConstants, LivestockConstants } from '@/constants/types';
import {
  beefConstants,
  commonConstants,
  livestockConstants,
  savannaConstants,
  sheepConstants,
} from '@/constants/values';
import { ConstantsForBeefCalculator } from '../Beef/constants';
import { ConstantsForSheepCalculator } from '../Sheep/constants';

export type ConstantsForSheepBeefCalculator = ConstantsForSheepCalculator &
  ConstantsForBeefCalculator;

export const sheepBeefConstants: ConstantsForSheepBeefCalculator = {
  SHEEP: sheepConstants,
  BEEF: beefConstants,
  SAVANNA: savannaConstants,
  COMMON: commonConstants,
  LIVESTOCK: livestockConstants,
};

export type HasLivestockConstants = {
  LIVESTOCK: LivestockConstants;
  COMMON: CommonConstants;
};
