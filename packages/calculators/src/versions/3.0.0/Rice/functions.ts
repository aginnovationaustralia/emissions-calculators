import { ExecutionContext } from '../executionContext';
import { RiceCrop } from '../types/Rice/rice.input';

export function getNitrogenFertiliser(
  context: ExecutionContext,
  rice: RiceCrop,
) {
  const { constants } = context;

  return (
    rice.ureaApplication * constants.FERTILISER_CONTENT.UREA.N +
    rice.nonUreaNitrogen +
    rice.ureaAmmoniumNitrate * constants.FERTILISER_CONTENT.UAN.N
  );
}

export function getUreaMass(context: ExecutionContext, rice: RiceCrop) {
  const { constants } = context;

  return (
    rice.ureaApplication + rice.ureaAmmoniumNitrate * constants.GWP_FACTORSC22
  );
}

export function getFertiliserFractionRunoff(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_FRACTION_RUNOFF_STATIC;
}
