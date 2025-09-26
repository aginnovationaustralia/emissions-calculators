import {
  constants,
  feedlotConstants,
  livestockConstants,
} from '../constants/constant_values';
import {
  Constants,
  FeedlotConstants,
  LivestockConstants,
} from '../constants/versionedConstants';

export type ConstantsForFeedlotCalculator = {
  FEEDLOT: FeedlotConstants;
  COMMON: Constants;
  LIVESTOCK: LivestockConstants;
};

export const constantsForFeedlotCalculator: ConstantsForFeedlotCalculator = {
  FEEDLOT: feedlotConstants,
  COMMON: constants,
  LIVESTOCK: livestockConstants,
};
