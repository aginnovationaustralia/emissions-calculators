import { constants, feedlotConstants } from '../constants/constant_values';
import { Constants, FeedlotConstants } from '../constants/versionedConstants';

export type ConstantsForFeedlotCalculator = {
  FEEDLOT: FeedlotConstants;
  COMMON: Constants;
};

export const constantsForFeedlotCalculator: ConstantsForFeedlotCalculator = {
  FEEDLOT: feedlotConstants,
  COMMON: constants,
};
