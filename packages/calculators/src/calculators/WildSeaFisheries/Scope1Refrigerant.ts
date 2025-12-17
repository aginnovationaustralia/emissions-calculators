import { WildSeaFisheriesRefrigerant } from '@/types/WildSeaFisheries/refrigerant.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForWildSeaFisheriesCalculator } from './constants';

export function calculateScope1Refrigerant(
  refrigerants: WildSeaFisheriesRefrigerant[],
  context: ExecutionContext<ConstantsForWildSeaFisheriesCalculator>,
) {
  const total = refrigerants.reduce((acc, { refrigerant, annualRecharge }) => {
    const gwp = context.constants.COMMON.REFRIGERANT_GWP[refrigerant];
    return acc + (gwp * annualRecharge) / 1000;
  }, 0);

  return total;
}
