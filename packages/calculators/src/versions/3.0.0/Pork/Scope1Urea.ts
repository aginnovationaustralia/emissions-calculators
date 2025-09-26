import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';
import { ConstantsForPorkCalculator } from './constants';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  // (Urea_ApplicationC9)
  const totalMassFertiliser =
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated +
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated;

  // (Urea_ApplicationD15)
  const ureaCarbonFraction = constants.LIVESTOCK.CARBON_FRACTION_OF_UREA;

  // (Urea_ApplicationC17)
  const cTonnes =
    totalMassFertiliser * ureaCarbonFraction * constants.COMMON.GWP_FACTORSC13;
  return cTonnes;
}
