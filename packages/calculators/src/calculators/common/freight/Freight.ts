import { FreightInput } from '@/types/common/freight.input';
import { ExecutionContext } from '../../executionContext';

export function calculateFreight(
  freight: FreightInput[],
  context: ExecutionContext,
) {
  const { FREIGHT_KG_TONNE_EF } = context.constants.COMMON;
  return freight.reduce((acc, { type, totalKmTonnes }) => {
    const ef = FREIGHT_KG_TONNE_EF[type];
    const co2 = ef * totalKmTonnes;

    return acc + co2;
  }, 0);
}
