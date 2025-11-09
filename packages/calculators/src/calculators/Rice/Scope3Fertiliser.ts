import { RiceCrop } from '@/types/Rice/rice.input';
import { ExecutionContext } from '../executionContext';
import { calculateScope3Fertiliser as calculateScope3FertiliserGrains } from '../Grains/Scope3Fertiliser';
import { ConstantsForRiceCalculator } from './constants';

export function calculateScope3Fertiliser(
  rice: RiceCrop,
  context: ExecutionContext<ConstantsForRiceCalculator>,
) {
  return calculateScope3FertiliserGrains(rice, context).total;
}
