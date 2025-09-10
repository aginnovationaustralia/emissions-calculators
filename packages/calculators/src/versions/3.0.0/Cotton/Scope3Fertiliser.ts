import { ExecutionContext } from '../executionContext';
import { calculateScope3Fertiliser as calculateScope3FertiliserGrains } from '../Grains/Scope3Fertiliser';
import { CottonCrop } from '../types/Cotton/cotton.input';

export function calculateScope3Fertiliser(
  cotton: CottonCrop,
  context: ExecutionContext,
) {
    return calculateScope3FertiliserGrains(cotton, context).total;
  }

