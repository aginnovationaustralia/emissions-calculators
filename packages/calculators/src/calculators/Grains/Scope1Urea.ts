import { GrainsCrop } from '@/types/Grains/crop.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGrainsCalculator } from './constants';

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

  // (dataSummary_B7)
  const total = massFertiliserGg * 1000;
  return total;
}
