import { ConstantsForGrainsCalculator } from '@/constants/types';
import { GrainsCrop } from '@/types/Grains';
import { ExecutionContext } from '../executionContext';

export function calculateScope1Urea(
  crop: GrainsCrop,
  context: ExecutionContext<ConstantsForGrainsCalculator>,
) {
  const { constants } = context;

  const uan = crop.ureaAmmoniumNitrate * 0.35;

  const totalUreaApplied = crop.ureaApplication + uan;

  const totalMassOfFertiliser = crop.areaSown * totalUreaApplied * 10 ** -3;

  const massFertiliserGg =
    totalMassOfFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;

  const total = massFertiliserGg * 1000;
  return total;
}
