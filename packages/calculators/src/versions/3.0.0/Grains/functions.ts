import { ExecutionContext } from '../executionContext';
import { CropType, State } from '../types/types';

export function getAnnualN2OProductionEF(context: ExecutionContext) {
  const { constants } = context;

  return constants.CROP_RESIDUE_N2O_EF;
}

export function getUreaNConstant(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_CONTENT.UREA.N;
}

export function getUanNConstant(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_CONTENT.UAN.N;
}

export function getCropResidueFractionRemoved(
  context: ExecutionContext,
  cropType: CropType,
  state: State,
) {
  const { constants } = context;

  const intermediaryRemovedTypes: { [type in CropType]?: number } = {
    'Tuber and Roots': 1,
    Cotton: 0,
    Hops: 0,
    'Forage Crops': 0.8,
    Lucerne: 0,
    'Other legume': 0,
    'Annual grass': 0,
    'Grass clover mixture': 0,
    'Perennial pasture': 0,
  };

  if (cropType === 'Sugar Cane') {
    /*
     * Technically, the sugar calculator should be used instead of the grains calculator.
     * It's been removed from the GAF sheet, but is still supported here for now.
     */
    return constants.CROPRESIDUE_FRACTIONSUGARCANEBURNT[state].removed;
  }
  return (
    intermediaryRemovedTypes[cropType] ??
    constants.CROPRESIDUE_PROPORTIONBURNT[state].removed
  );
}

export function getFertiliserFractionRunoff(context: ExecutionContext) {
  const { constants } = context;

  return constants.FERTILISER_FRACTION_RUNOFF_STATIC;
}
