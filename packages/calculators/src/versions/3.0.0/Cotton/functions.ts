import { ExecutionContext } from '../executionContext';
import { CottonCrop } from '../types/Cotton/cotton.input';
import { ConstantsForCottonCalculator } from './constants';

export function getNitrogenFertiliser(
  context: ExecutionContext<ConstantsForCottonCalculator>,
  cotton: CottonCrop,
) {
  const { constants } = context;

  return (
    cotton.ureaApplication * constants.COMMON.FERTILISER_CONTENT.UREA.N +
    cotton.nonUreaNitrogen +
    cotton.ureaAmmoniumNitrate * constants.COMMON.FERTILISER_CONTENT.UAN.N
  );
}

export function getUreaMass(
  context: ExecutionContext<ConstantsForCottonCalculator>,
  cotton: CottonCrop,
) {
  const { constants } = context;

  return (
    cotton.ureaApplication +
    cotton.ureaAmmoniumNitrate * constants.COMMON.GWP_FACTORSC22
  );
}

export function getFertiliserFractionRunoff(
  context: ExecutionContext<ConstantsForCottonCalculator>,
) {
  const { constants } = context;

  return constants.CROP.FERTILISER_FRACTION_RUNOFF_STATIC;
}

export function getIntensityDenominators(crop: CottonCrop) {
  const totalBales =
    ((crop.averageCottonYield * 1000) /
      (crop.averageWeightPerBaleKg - crop.wastePerBaleKg)) *
    crop.areaSown;

  return {
    bales: totalBales,
    lintMassTonnes: (totalBales * crop.cottonLintPerBaleKg) / 1000,
    seedMassTonnes: (totalBales * crop.cottonSeedPerBaleKg) / 1000,
  };
}
