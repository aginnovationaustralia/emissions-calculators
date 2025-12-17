import { ExecutionContext } from '../../executionContext';

export function calculateCommercialFlights(
  flightDistance: number,
  context: ExecutionContext,
) {
  const { constants } = context;

  return flightDistance * constants.COMMON.COMMERCIALFLIGHT_EF;
}
