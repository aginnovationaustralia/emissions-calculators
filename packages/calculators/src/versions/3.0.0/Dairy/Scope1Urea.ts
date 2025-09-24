import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (ureaApplicationC29)
  const totalMassFertiliser =
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  // (ureaApplicationC37)
  const carbon =
    totalMassFertiliser *
    constants.CARBON_FRACTION_OF_UREA *
    constants.GWP_FACTORSC13 *
    10 ** -3;

  return carbon;
}
