import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (ureaApplicationC10)
  const totalMassOfFertiliser =
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  // (ureaApplicationC19)
  const massFertiliserGg =
    totalMassOfFertiliser * constants.FERTILISER_EF * constants.GWP_FACTORSC13;

  return massFertiliserGg;
}
