import { ExecutionContext } from '../../executionContext';
import { RefrigerantInput } from '../../types/refrigerant.input';

export function calculateScope1Refrigerant(
  refrigerants: RefrigerantInput[],
  context: ExecutionContext,
) {
  const { constants } = context;

  // resulting units is tonnes CO2e
  return refrigerants.reduce((acc, { refrigerant, chargeSize }) => {
    // chargeSize is in kg
    const factor = constants.COMMON.REFRIGERANT_GWP[refrigerant];

    return acc + (factor * chargeSize) / 1000;
  }, 0);
}
