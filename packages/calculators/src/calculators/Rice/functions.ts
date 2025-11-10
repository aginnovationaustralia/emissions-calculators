import { RiceCrop } from '@/types/Rice/rice.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForRiceCalculator } from './constants';

export function getNitrogenFertiliser(
  context: ExecutionContext<ConstantsForRiceCalculator>,
  rice: RiceCrop,
) {
  const { constants } = context;

  return (
    rice.ureaApplication * constants.COMMON.FERTILISER_CONTENT.UREA.N +
    rice.nonUreaNitrogen +
    rice.ureaAmmoniumNitrate * constants.COMMON.FERTILISER_CONTENT.UAN.N
  );
}

export function getUreaMass(
  context: ExecutionContext<ConstantsForRiceCalculator>,
  rice: RiceCrop,
) {
  const { constants } = context;

  return (
    rice.ureaApplication +
    rice.ureaAmmoniumNitrate * constants.COMMON.GWP_FACTORSC22
  );
}

export function getFertiliserFractionRunoff(
  context: ExecutionContext<ConstantsForRiceCalculator>,
) {
  const { constants } = context;

  return constants.CROP.FERTILISER_FRACTION_RUNOFF_STATIC;
}
