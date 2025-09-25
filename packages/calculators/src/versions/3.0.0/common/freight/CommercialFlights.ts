import { ExecutionContext } from '../../executionContext';
import { CommonConstants } from '../constants';

export function calculateCommercialFlights(
  flightDistance: number,
  context: ExecutionContext<CommonConstants>,
) {
  const { constants } = context;

  return flightDistance * constants.COMMON.COMMERCIALFLIGHT_EF;
}
