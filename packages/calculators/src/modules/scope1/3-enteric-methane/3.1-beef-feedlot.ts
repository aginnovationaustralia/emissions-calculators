import { ExecutionContext } from '@/calculators/executionContext';
import { FeedlotGroupLivestockInputTransformed } from '@/calculators/Feedlot/types/feedlot-group.input';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { br, num } from '@/tools/containers';
import { tenToPowMinus3 } from '@/tools/sentinels';
import { sum } from '@/tools/sum';
import { massPerHeadPerDay, realNumber } from '@/tools/units';
import {
  getDryMatterIntake,
  getGroupDuration,
  getNeutralDetergentFibrePercentage,
} from '../shared/feedlot/helpers';

function calculateDailyMethaneProductionForGroup(
  group: FeedlotGroupLivestockInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
) {
  /*
    3.1.1.1 (2)
    M j = (5.11 * Ij - 4.00 * EEj + 2.26 * NDFj) * 10^-3
    Ij = dry matter intake (kg DM/head/day)
    EEj = ether extract as a percentage of I j (per cent)
    NDFj = neutral detergent fibre as a percentage of I j (per cent)
    */

  const herdDurationType = getGroupDuration(group);

  const Ij = getDryMatterIntake(group, constants);

  const EEj = selectConstant(
    constants.FEEDLOT,
    'FEED',
    herdDurationType,
    'etherExtractPercentage',
  ).named('EEj default');
  const NDFj = getNeutralDetergentFibrePercentage(group, constants);

  // Feed is converted from dry matter to methane production
  const Mj = br(
    num(5.11)
      .multiply(Ij)
      .switchUnit((r) => realNumber(r.store))
      .minus(num(4.0).multiply(EEj))
      .plus(num(2.26).multiply(NDFj))
      .multiply(tenToPowMinus3),
  )
    .named('Mj')
    .switchUnit((r) => massPerHeadPerDay('CH4', r.store));

  return Mj.reference('3.1.1.1 (2)');
}

function calculateEntericMethaneForGroup(
  group: FeedlotGroupLivestockInputTransformed,
  constants: HasConstants<'FEEDLOT'>,
) {
  /*
    3.1.1.1 (1)
    Menteric = SUM (Dj * Mj * Nj)
    Dj = duration of stay of each cattle lot (j) (days)
    Mj = daily methane production (kgCH4/head/day)
    Nj = numbers of feedlot cattle in each cattle lot (head)
    */

  const { averageLengthOfStayDays, head } = group;

  const Mj = calculateDailyMethaneProductionForGroup(group, constants);

  return Mj.multiply(head)
    .multiply(averageLengthOfStayDays)
    .named(`Eenteric (j)`)
    .reference('3.1.1.1 (1)');
}

export function calculate31BeefFeedlotEntericMethane(
  input: { groups: FeedlotGroupLivestockInputTransformed[] },
  context: ExecutionContext<HasConstants<'COMMON' | 'FEEDLOT'>>,
) {
  return sum(
    input.groups.map((group) =>
      calculateEntericMethaneForGroup(group, context.constants),
    ),
  ).named(`Eenteric`);
}
