import { ExecutionContext } from '@/calculators/executionContext';
import { FeedlotGroupInputTransformed } from '@/calculators/Feedlot/types/feedlot-group.input';
import { FeedlotInputTransformed } from '@/calculators/Feedlot/types/input';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { groupDurationToDurationType } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { tenToPowMinus3 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay, realNumber } from '@/tools/units';

function calculateDailyMethaneProductionForGroup(
  group: FeedlotGroupInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
    3.1 line 63
    Me j = (5.11 * Ij - 4.00 * EEj + 2.26 * NDFj) * 10^-3
    Ij = dry matter intake (kg DM/head/day)
    EEj = ether extract as a percentage of I j (per cent)
    NDFj = neutral detergent fibre as a percentage of I j (per cent)
    */

  // REVISIT: Loss of input container. It could be done as an input transform
  const herdDurationType = groupDurationToDurationType(
    group.averageLengthOfStayDays.unit.value.toNumber(),
  );

  const Ij =
    group.method2AverageDryMatterIntake ??
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      herdDurationType,
      'DRY_MATTER_INTAKE',
    ).named('Ij default');

  const EEj = selectConstant(
    constants.FEEDLOT,
    'FEED',
    herdDurationType,
    'ETHER_EXTRACT_PERCENTAGE',
  ).named('EEj default');
  const NDFj =
    group.method2AverageNeutralDetergentFibrePercentage ??
    selectConstant(
      constants.FEEDLOT,
      'FEED',
      herdDurationType,
      'NEUTRAL_DETERGENT_FIBRE_PERCENTAGE',
    ).named('NDFj default');

  // Feed is converted from dry matter to methane production
  const Mej = br(
    num(5.11)
      .multiply(Ij)
      .switchUnit((r) => realNumber(r.value))
      .minus(num(4.0).multiply(EEj))
      .plus(num(2.26).multiply(NDFj))
      .multiply(tenToPowMinus3),
  )
    .named('Mej')
    .switchUnit((r) => massPerHeadPerDay('CH4', r.value));

  return Mej;
}

function calculateEntericMethaneForGroup(
  group: FeedlotGroupInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  /*
    3.1 line 56
    Menteric = SUM (Lj * Mej * N j)
    Lj = average length of stay of each cattle group (j) (days)
    Mej = methane production (kgCH4/head/day)
    Nj = numbers of beef cattle (head)
    */

  const { averageLengthOfStayDays, head } = group;

  const Mej = calculateDailyMethaneProductionForGroup(group, context);

  const Menteric = Mej.multiply(head).multiply(averageLengthOfStayDays);

  return Menteric;
}

export function calculate31BeefFeedlotEntericMethane(
  input: FeedlotInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;
  /*
    3.1 line 51
    Etotal = Menteric * GWPCH4 * 10^-3
    Where Menteric = total annual methane production (kgCH4)
    GWPCH4 = the GWP of methane to convert tCH4 to tCO2e
*/

  const { groups } = input;

  const Menteric = sum(
    groups.map((group) => calculateEntericMethaneForGroup(group, context)),
  );

  const GWPCH4 = selectConstant(constants.COMMON, 'GWP_CH4');

  const Etotal = Menteric.multiply(GWPCH4, { name: 'Etotal' });

  return Etotal;
}
