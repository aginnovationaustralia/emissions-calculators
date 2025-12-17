import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForFeedlotCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForFeedlotCalculator>,
) {
  const { constants } = context;

  const totalMassOfFertiliser =
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  const massFertiliserGg =
    totalMassOfFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13;

  return massFertiliserGg;
}
