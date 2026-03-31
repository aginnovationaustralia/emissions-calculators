import { BeefInputTransformed } from '@/calculators/Beef/types/input';
import { ExecutionContext } from '@/calculators/executionContext';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { BeefClass, Season } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, Container, num } from '@/tools/containers';
import { oneMinus } from '@/tools/sentinels';
import { massPerHeadPerDay, RealNumber, realNumber } from '@/tools/units';

export const calculateDryMatterIntakeIijkln = (
  input: BeefInputTransformed,
  className: BeefClass,
  season: Season,
  proportionCowsCalvingLC: Container<RealNumber>,
  feedAdjustmentForCowsGt2: Container<RealNumber>,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) => {
  /*
    MAijkl=5 = (LCijkl=5 * FAijkl=5) + (1 - LCijkl=5 ) -- line 143
    */
  const LC = proportionCowsCalvingLC.named('LCijkl=5');
  const FC = feedAdjustmentForCowsGt2.named('FCijkl=5');
  const MAijkl = br(LC.multiply(FC))
    .plus(br(oneMinus(LC)))
    .switchUnit((u) => massPerHeadPerDay('DryMatter', u.value))
    .named('MAijkl=5');

  /*
    Iijkln = (1.185 + 0.00454 * Wijkln - 0.0000026 * Wijkln ^ 2 + 0.315 * LWGijkln) ^ 2 * MAijkl=5 -- line 136
*/
  const { constants } = context;
  const { region } = input;

  const Wijkln = selectConstant(
    constants.BEEF_PASTURE,
    'LIVEWEIGHT',
    region,
    className,
    season,
    'liveweight',
  );
  const LWGijkln = selectConstant(
    constants.BEEF_PASTURE,
    'LIVEWEIGHT',
    region,
    className,
    season,
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
