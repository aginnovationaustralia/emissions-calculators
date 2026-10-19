import { ExecutionContext } from '@/calculators/executionContext';
import { HasConstants } from '@/constants/types';
import { selectConstant } from '@/tools/constants';
import { HasAquacultureSystemInputTransformed } from './aquaculture-system.input';

export function calculateScope1AquaticN2O(
  { fishery }: HasAquacultureSystemInputTransformed,
  { constants }: ExecutionContext<HasConstants<'AQUACULTURE' | 'COMMON'>>,
) {
  const EF = selectConstant(
    constants.AQUACULTURE,
    'AQUACULTURE_EF',
    fishery.location,
  ).named('EF');
  const CN2O = selectConstant(
    constants.COMMON,
    'ELEMENTAL_TO_MOLECULAR_N2O',
  ).named('CN2O');
  /**
   * From Chapter 13:
   *
   * "Due to limited research on nitrous oxide emissions generated in aquaculture, and
   * the range of parameters that can impact these emissions, this emission source should
   * only be accounted for in aquaculture systems located in coastal wetland habitats.
   * Off-shore installations of fish cages in seagrass meadows are included in this."
   */
  return fishery.amountProduced
    .multiply(EF)
    .multiply(CN2O)
    .named('E')
    .reference('13.1.1 (1)');
}
