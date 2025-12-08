import { RiceCrop } from '@/types/Rice/rice.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForRiceCalculator } from './constants';
import { getUreaMass } from './functions';

export function calculateScope1Urea(
  rice: RiceCrop,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) {
  const { constants } = context;

  const massUrea = getUreaMass(context, rice);

  const totalMassFertiliser = rice.areaSown * massUrea * 10 ** -3;

  const totalGg =
    totalMassFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;
  const ureaCO2 = totalGg * 10 ** 3;

  return ureaCO2;
}
