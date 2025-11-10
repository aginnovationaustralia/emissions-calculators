import { SugarCrop } from '@/types/Sugar/sugar.input';
import { ExecutionContext } from '../executionContext';
import { ConstantsForSugarCalculator } from './constants';

export function getResidueBurned(crop: SugarCrop) {
  return crop.fractionOfAnnualCropBurnt;
}

export function getResidueRemoved(
  context: ExecutionContext<ConstantsForSugarCalculator>,
) {
  const { constants } = context;

  return constants.CROP.CROPRESIDUE['Sugar Cane'].fractionRemoved;
}

export function getUreaNConstant(
  context: ExecutionContext<ConstantsForSugarCalculator>,
) {
  const { constants } = context;

  return constants.COMMON.FERTILISER_CONTENT.UREA.N;
}

export function getUanNConstant(
  context: ExecutionContext<ConstantsForSugarCalculator>,
) {
  const { constants } = context;

  return constants.COMMON.FERTILISER_CONTENT.UAN.N;
}

export function getFertiliserFractionRunoff(
  context: ExecutionContext<ConstantsForSugarCalculator>,
) {
  const { constants } = context;

  return constants.CROP.FERTILISER_FRACTION_RUNOFF_STATIC;
}
