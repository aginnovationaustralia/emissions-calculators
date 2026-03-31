import {
  BeefClassSeasonInputTransformed,
  BeefClassWithCalvesSeasonInputTransformed,
  isSeasonInputWithCalves,
} from '@/calculators/Beef/types/beef-class-season.input';
import {
  BeefClassInputTransformed,
  BeefClassWithCalvesInputTransformed,
  isBeefClassWithCalves,
} from '@/calculators/Beef/types/beef-class.input';
import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BeefClass, Season } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { massPerHeadPerDay, realNumber } from '@/tools/units';

const getProportionCowsGt2InCalfLC = (
  season:
    | BeefClassSeasonInputTransformed
    | BeefClassWithCalvesSeasonInputTransformed,
) => {
  if (isSeasonInputWithCalves(season)) {
    return season.proportionCowsGt2InCalf.named('LCijkl=5');
  }
  return num(0).named('LC (0)');
};

const getPreviousSeason = (seasonName: Season) => {
  if (seasonName === 'spring') {
    return 'winter';
  }
  if (seasonName === 'summer') {
    return 'spring';
  }
  if (seasonName === 'winter') {
    return 'summer';
  }
  return 'spring';
};

const getFeedAdjustmentForCowsGt2FA = (
  classInput: BeefClassInputTransformed | BeefClassWithCalvesInputTransformed,
  seasonName: Season,
) => {
  if (!isBeefClassWithCalves(classInput)) {
    return num(1).named('FA (1)');
  }

  const season = classInput[seasonName];
  const LC = season.proportionCowsGt2InCalf.unit.value;

  if (LC.eq(0)) {
    const previousSeason = classInput[getPreviousSeason(seasonName)];

    const previousSeasonLC = previousSeason.proportionCowsGt2InCalf.unit.value;
    if (previousSeasonLC.gt(0)) {
      return num(previousSeasonLC.mul(0.1).plus(1)).named('FAijkl');
    } else {
      return num(1).named('FAijkl');
    }
  } else {
    return num(LC.mul(0.3).plus(1)).named('FAijkl');
  }
};

export const calculateDryMatterIntakeIijkln = (
  input: BeefInputTransformed,
  classInput: BeefClassInputTransformed | BeefClassWithCalvesInputTransformed,
  className: BeefClass,
  seasonName: Season,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    MAijkl=5 = (LCijkl=5 * FAijkl=5) + (1 - LCijkl=5 ) -- line 143
    */
  const season = classInput[seasonName];
  const LC = getProportionCowsGt2InCalfLC(season).named('LCijkl=5');
  const FC = getFeedAdjustmentForCowsGt2FA(classInput, seasonName).named(
    'FCijkl=5',
  );
  const MAijkl = br(LC.multiply(FC))
    .plus(br(oneMinus(LC)))
    .switchUnit((u) => massPerHeadPerDay('DryMatter', u.value))
    .named('MAijkl=5');

  /*
    Iijkln = (1.185 + 0.00454 * Wijkln - 0.0000026 * Wijkln ^ 2 + 0.315 * LWGijkln) ^ 2 * MAijkl=5 -- line 136
*/
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
