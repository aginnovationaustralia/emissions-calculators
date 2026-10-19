import {
  FeedlotGroupLivestockInputTransformed,
  FeedlotGroupSharedInputTransformed,
} from '@/calculators/Feedlot/types/feedlot-group.input';
import { groupDurationToDurationType } from '@/constants/translations';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { captureMethod1Or2Value } from '@/tools/multi';
import { MassPerHeadPerDay, MassPerMass, RealNumber } from '@/tools/units';

export const getGroupDuration = (group: FeedlotGroupSharedInputTransformed) =>
  groupDurationToDurationType(group.averageLengthOfStayDays);

/**
 * Wrapper for getting dry matter digestibility *DMDj* for a feedlot group.
 */
export const getDryMatterDigestibility = (
  group: FeedlotGroupLivestockInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
): Container<RealNumber> =>
  captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      getGroupDuration(group),
      'dryMatterDigestibility',
    ).named(`DMDj`),
    group.method2DryMatterDigestibility,
  );

/**
 * Wrapper for getting crude protein *CPj* for a feedlot group.
 */
export const getCrudeProtein = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
): Container<MassPerMass<'CrudeProtein', 'DryMatter'>> =>
  captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      getGroupDuration(group),
      'crudeProtein',
    ).named(`CPj`),
    group.method2CrudeProtein,
  );

/**
 * Wrapper for getting dry matter intake *Ij* for a feedlot group.
 */
export const getDryMatterIntake = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
): Container<MassPerHeadPerDay<'DryMatter'>> =>
  captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      getGroupDuration(group),
      'dryMatterIntake',
    ).named('Ij'),
    group.method2DryMatterIntake,
  );

/**
 * Wrapper for getting nitrogen retention rate *NRj* for a feedlot group.
 */
export const getNitrogenRetentionRate = (
  group: FeedlotGroupSharedInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
): Container<RealNumber> =>
  captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      getGroupDuration(group),
      'nitrogenRetentionRate',
    ).named(`NRj`),
    group.method2NitrogenRetentionRate,
  );

/**
 * Wrapper for getting percentage of feed intake that is neutral detergent fibre *NDFj*
 * for a feedlot group.
 */
export const getNeutralDetergentFibrePercentage = (
  group: FeedlotGroupLivestockInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
): Container<RealNumber> =>
  captureMethod1Or2Value(
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      getGroupDuration(group),
      'neutralDetergentFibrePercentage',
    ).named(`NDFj`),
    group.method2AverageNeutralDetergentFibrePercentage,
  );
