import { ExecutionContext } from '../executionContext';
import { Fertiliser } from '../types/fertiliser.input';

export function calculateScope1Urea(
  fertiliser: Fertiliser,
  context: ExecutionContext,
) {
  const { constants } = context;

  // (Urea_ApplicationC9)
  const totalMassFertiliser =
    fertiliser.cropsDryland +
    fertiliser.cropsIrrigated +
    fertiliser.pastureDryland +
    fertiliser.pastureIrrigated;

  // (Urea_ApplicationD15)
  const ureaCarbonFraction = constants.CARBON_FRACTION_OF_UREA;

  // (Urea_ApplicationC17)
  const cTonnes =
    totalMassFertiliser * ureaCarbonFraction * constants.GWP_FACTORSC13;
  return cTonnes;
}
