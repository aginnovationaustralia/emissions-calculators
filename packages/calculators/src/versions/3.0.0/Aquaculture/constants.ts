import { aquacultureConstants, constants } from '../constants/constant_values';
import {
  AquacultureConstants,
  Constants,
} from '../constants/versionedConstants';

export type ConstantsForAquacultureCalculator = {
  AQUACULTURE: AquacultureConstants;
  COMMON: Constants;
};

export const constantsForAquacultureCalculator: ConstantsForAquacultureCalculator =
  {
    AQUACULTURE: aquacultureConstants,
    COMMON: constants,
  };
