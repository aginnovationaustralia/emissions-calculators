import { ExecutionContext } from '../executionContext';
import { HorticultureCrop } from '../types/Horticulture/horticulture.input';

export function calculateScope1Urea(
  horticulture: HorticultureCrop,
  context: ExecutionContext,
) {
  const { constants } = context;
  // co2

  // (Urea_ApplicationC8)
  const totalMassFertiliser =
    horticulture.areaSown *
    (horticulture.ureaApplication +
      horticulture.ureaAmmoniumNitrate * constants.GWP_FACTORSC22) *
    10 ** -3;

  // (Urea_ApplicationC18)
  const totalGg =
    totalMassFertiliser *
    constants.FERTILISER_EF *
    constants.GWP_FACTORSC13 *
    10 ** -3;
  const ureaCO2 = totalGg * 10 ** 3;

  return ureaCO2;
}
