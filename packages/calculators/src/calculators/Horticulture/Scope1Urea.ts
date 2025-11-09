import { HorticultureCrop } from '@/types/Horticulture/horticulture.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForHorticultureCalculator } from './constants';

export function calculateScope1Urea(
  horticulture: HorticultureCrop,
  context: ExecutionContext<ConstantsForHorticultureCalculator>,
) {
  const { constants } = context;

  // (Urea_ApplicationC8)
  const totalMassFertiliser =
    horticulture.areaSown *
    (horticulture.ureaApplication +
      horticulture.ureaAmmoniumNitrate * constants.COMMON.GWP_FACTORSC22) *
    10 ** -3;

  // (Urea_ApplicationC18)
  const totalGg =
    totalMassFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;
  const ureaCO2 = totalGg * 10 ** 3;

  return ureaCO2;
}
