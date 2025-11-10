import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForDeerCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForDeerCalculator>,
) {
  const { constants } = context;

  // (ureaApplicationC29)
  const totalMassFertiliser =
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated +
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated;

  // (ureaApplicationC37)
  // NOTE: deer calc does not have / 1000
  const carbon =
    totalMassFertiliser *
    constants.LIVESTOCK.CARBON_FRACTION_OF_UREA *
    constants.COMMON.GWP_FACTORSC13;

  return carbon;
}
