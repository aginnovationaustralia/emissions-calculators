import { isSeasonInputWithCalves } from '@/calculators/Beef/types/beef-class-season.input';
import {
  BeefClassInputTransformed,
  BeefClassWithCalvesInputTransformed,
  isBeefClassWithCalves,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefSpecificClassInputTransformed } from '@/calculators/Beef/types/beef-classes.input';
import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { Season } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { one, oneMinus } from '@/tools/sentinels';
import { massPerHeadPerDay, realNumber } from '@/tools/units';

const getPreviousSeason = (seasonName: Season) => {
  if (seasonName === 'spring') {
    return 'winter';
  }
  if (seasonName === 'summer') {
    return 'spring';
  }
  if (seasonName === 'autumn') {
    return 'summer';
  }
  return 'autumn';
};

const getProportionCowsGt2InCalfLC = (
  classInput: BeefClassInputTransformed | BeefClassWithCalvesInputTransformed,
  seasonName: Season,
) => {
  const currentSeason = classInput[seasonName];
  const previousSeason = classInput[getPreviousSeason(seasonName)];
  if (
    !isSeasonInputWithCalves(currentSeason) ||
    !isSeasonInputWithCalves(previousSeason)
  ) {
    return num(0).named('LC (0)');
  }

  return currentSeason.proportionCowsGt2ThisSeasonInCalf
    .plus(previousSeason.proportionCowsGt2ThisSeasonInCalf)
    .named('LCijkl=5');
};

const getFeedAdjustmentForCowsGt2FA = (
  classInput: BeefClassInputTransformed | BeefClassWithCalvesInputTransformed,
  seasonName: Season,
) => {
  if (!isBeefClassWithCalves(classInput)) {
    return num(1).named('FA (1)');
  }

  // REVISIT: We need to review the logic used to calculate FA. There is an example in the test sheet showing why it is probably incorrect
  const currentSeason = classInput[seasonName];
  const currentSeasonInCalf =
    currentSeason.proportionCowsGt2ThisSeasonInCalf.named(
      `Cows calving (${seasonName})`,
    );

  const previousSeasonName = getPreviousSeason(seasonName);
  const previousSeason = classInput[previousSeasonName];
  const previousSeasonInCalf =
    previousSeason.proportionCowsGt2ThisSeasonInCalf.named(
      `Cows calving (${previousSeasonName})`,
    );

  return one
    .plus(num(0.3).multiply(currentSeasonInCalf))
    .plus(num(0.1).multiply(previousSeasonInCalf))
    .named('FAijkl=5 (${seasonName})');
};

export const calculateDryMatterIntakeIijkln = (
  input: BeefInputTransformed,
  classInput: BeefSpecificClassInputTransformed,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  const className = classInput.name;
  const season = classInput[seasonName];
  const LC = getProportionCowsGt2InCalfLC(classInput, seasonName);
  const FA = getFeedAdjustmentForCowsGt2FA(classInput, seasonName);
  /*
    MAijkl=5 = (LCijkl=5 * FAijkl=5) + (1 - LCijkl=5 ) -- line 143
  */
  const MAijkl = br(LC.multiply(FA))
    .plus(br(oneMinus(LC)))
    .switchUnit((u) => massPerHeadPerDay('DryMatter', u.value))
    .named(`MAijkl=5 (${className}, ${seasonName})`);

  const { constants } = context;
  const { region } = input;

  const Wijkln =
    season.method2Liveweight ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      region,
      className,
      seasonName,
      'liveweight',
    );
  const LWGijkln =
    season.method2LiveweightGain ??
    selectConstant(
      constants.BEEF_PASTURE,
      'LIVEWEIGHT',
      region,
      className,
      seasonName,
      'liveweightGain',
    );

  /*
    Iijkln = (1.185 + 0.00454 * Wijkln - 0.0000026 * Wijkln ^ 2 + 0.315 * LWGijkln) ^ 2 * MAijkl=5 -- line 136
  */
  const Iijkln = br(
    num(1.185)
      .plus(num(0.00454).multiply(Wijkln))
      .minus(num(0.0000026).multiply(Wijkln.squared()))
      .switchUnit((u) => massPerHeadPerDay('Liveweight', u.value))
      .plus(num(0.315).multiply(LWGijkln)),
  )
    .squared()
    .switchUnit((u) => realNumber(u.value))
    .multiply(MAijkl)
    .named('Iijkln');

  return Iijkln;
};
