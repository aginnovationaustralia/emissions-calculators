import {
  constants,
  livestockConstants,
  sheepConstants,
} from '../constants/constant_values';
import {
  Constants,
  LivestockConstants,
  SheepConstants,
} from '../constants/versionedConstants';

export type ConstantsForSheepCalculator = {
  SHEEP: SheepConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const sheepBeefConstants: ConstantsForSheepCalculator = {
  SHEEP: sheepConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
