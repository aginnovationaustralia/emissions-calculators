import { CottonCrop } from '@/types/Cotton/cotton.input';
import { ExecutionContext } from '../executionContext';
import { calculateScope3Fertiliser as calculateScope3FertiliserGrains } from '../Grains/Scope3Fertiliser';
import { ConstantsForCottonCalculator } from './constants';

export function calculateScope3Fertiliser(
  cotton: CottonCrop,
  context: ExecutionContext<ConstantsForCottonCalculator>,
) {
  return calculateScope3FertiliserGrains(cotton, context).total;
}
