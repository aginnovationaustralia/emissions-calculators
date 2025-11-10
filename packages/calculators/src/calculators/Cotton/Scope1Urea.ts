import { CottonCrop } from '@/types/Cotton/cotton.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForCottonCalculator } from './constants';
import { getUreaMass } from './functions';

export function calculateScope1Urea(
  cotton: CottonCrop,
  context: ExecutionContext<ConstantsForCottonCalculator>,
) {
  const { constants } = context;

  const massUrea = getUreaMass(context, cotton);

  // (Urea_ApplicationC8)
  const totalMassFertiliser = cotton.areaSown * massUrea * 10 ** -3;

  // (Urea_ApplicationC18)
  const totalGg =
    totalMassFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;
  const ureaCO2 = totalGg * 10 ** 3;

  return ureaCO2;
}
