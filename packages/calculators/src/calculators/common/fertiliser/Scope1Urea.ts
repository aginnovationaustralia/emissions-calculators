import { ExecutionContext } from '../../executionContext';
import { CropWithUrea, getUreaMass } from './fertiliser';

export function calculateScope1Urea(
  crop: CropWithUrea,
  totalArea: number,
  context: ExecutionContext,
) {
  const { constants } = context;

  const massUrea = getUreaMass(context, crop);

  const totalMassFertiliser = totalArea * massUrea * 10 ** -3;

  const totalGg =
    totalMassFertiliser *
    constants.COMMON.FERTILISER_EF *
    constants.COMMON.GWP_FACTORSC13 *
    10 ** -3;
  const ureaCO2 = totalGg * 10 ** 3;

  return ureaCO2;
}
