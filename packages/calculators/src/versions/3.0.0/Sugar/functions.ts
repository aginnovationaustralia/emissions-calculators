import { ExecutionContext } from '../executionContext';
import { SugarCrop } from '../types/Sugar/sugar.input';

export function getResidueBurned(crop: SugarCrop) {
  return crop.fractionOfAnnualCropBurnt;
}

export function getResidueRemoved(context: ExecutionContext) {
  const { constants } = context;

  return constants.CROPRESIDUE['Sugar Cane'].fractionRemoved;
}

export function getUreaNConstant(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_CONTENT.UREA.N;
}

export function getUanNConstant(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_CONTENT.UAN.N;
}

export function getFertiliserFractionRunoff(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_FRACTION_RUNOFF_STATIC;
}
