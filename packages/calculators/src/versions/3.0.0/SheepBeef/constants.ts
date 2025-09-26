import { ConstantsForBeefCalculator } from '../Beef/constants';
import {
  beefConstants,
  constants,
  livestockConstants,
  savannaConstants,
  sheepConstants,
} from '../constants/constant_values';
import { Constants, LivestockConstants } from '../constants/versionedConstants';
import { ConstantsForSheepCalculator } from '../Sheep/constants';

export type ConstantsForSheepBeefCalculator = ConstantsForSheepCalculator &
  ConstantsForBeefCalculator;

export const sheepBeefConstants: ConstantsForSheepBeefCalculator = {
  SHEEP: sheepConstants,
  BEEF: beefConstants,
  SAVANNA: savannaConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};

export type HasLivestockConstants = {
  LIVESTOCK: LivestockConstants;
  COMMON: Constants;
};
