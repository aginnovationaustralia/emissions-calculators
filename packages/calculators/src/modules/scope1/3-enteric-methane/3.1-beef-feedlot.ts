import { ExecutionContext } from '@/calculators/executionContext';
import { FeedlotInputTransformed } from '@/calculators/Feedlot/types/input';
import { ConstantsForGrainsCalculator } from '@/calculators/Grains/constants';
import { root } from '@/tools/containers';
import { mass } from '@/tools/units';

export function calculate31BeefFeedlotEntericMethane(
  input: FeedlotInputTransformed,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  return root(mass('CO2e', 0)).named('Etotal');
}
