import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';
import { ConstantsForFeedlotCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
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
    totalMassOfFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13;

  return massFertiliserGg;
}
