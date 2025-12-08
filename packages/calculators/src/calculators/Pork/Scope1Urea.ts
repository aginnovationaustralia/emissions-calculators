import { Fertiliser } from '@/types/fertiliser.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  const totalMassFertiliser =
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated +
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated;

  const ureaCarbonFraction = constants.LIVESTOCK.CARBON_FRACTION_OF_UREA;

  const cTonnes =
    totalMassFertiliser * ureaCarbonFraction * constants.COMMON.GWP_FACTORSC13;
  return cTonnes;
}
