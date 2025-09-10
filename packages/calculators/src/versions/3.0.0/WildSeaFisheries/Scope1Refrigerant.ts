import { ExecutionContext } from '../executionContext';
import { WildSeaFisheriesRefrigerant } from '../types/WildSeaFisheries/refrigerant.input';

export function calculateScope1Refrigerant(
  refrigerants: WildSeaFisheriesRefrigerant[],
  context: ExecutionContext,
) {
  const total = refrigerants.reduce((acc, { refrigerant, annualRecharge }) => {
    const gwp = context.constants.REFRIGERANT_GWP[refrigerant];
    return acc + (gwp * annualRecharge) / 1000;
  }, 0);

  return total;
}
