import { ExecutionContext } from '../executionContext';
import { calculateScope3Fertiliser as calculateScope3FertiliserGrains } from '../Grains/Scope3Fertiliser';
import { RiceCrop } from '../types/Rice/rice.input';

export function calculateScope3Fertiliser(
  rice: RiceCrop,
  context: ExecutionContext,
) {
  return calculateScope3FertiliserGrains(rice, context).total;
}
