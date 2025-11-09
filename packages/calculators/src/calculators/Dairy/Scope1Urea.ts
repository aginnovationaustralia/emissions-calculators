import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDairyCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForDairyCalculator>,
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
    constants.LIVESTOCK.CARBON_FRACTION_OF_UREA *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;

  return carbon;
}
