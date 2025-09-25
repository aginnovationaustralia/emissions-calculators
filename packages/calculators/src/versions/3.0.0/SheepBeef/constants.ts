import { ConstantsForBeefCalculator } from '../Beef/constants';
import {
  beefConstants,
  constants,
  savannaConstants,
  sheepConstants,
} from '../constants/constant_values';
import { ConstantsForSheepCalculator } from '../Sheep/constants';

export type ConstantsForSheepBeefCalculator = ConstantsForSheepCalculator &
  ConstantsForBeefCalculator;

export const sheepBeefConstants: ConstantsForSheepBeefCalculator = {
  SHEEP: sheepConstants,
  BEEF: beefConstants,
  SAVANNA: savannaConstants,
  COMMON: constants,
};
