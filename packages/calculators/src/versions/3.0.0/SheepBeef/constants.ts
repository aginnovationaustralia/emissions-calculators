import { constants, sheepConstants } from '../constants/constant_values';
import { Constants, SheepConstants } from '../constants/versionedConstants';

export type SheepBeefConstants = {
  SHEEP: SheepConstants;
  COMMON: Constants;
};

export const sheepBeefConstants: SheepBeefConstants = {
  SHEEP: sheepConstants,
  COMMON: constants,
};
