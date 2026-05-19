import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../executionContext';
import { calculateGrains as calculateGrainsInternal } from './calculator';
import {
  GrainsOutput,
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from './types';

function calculateGrains(
  input: GrainsInputTransformed,
  options?: CalculatorOptions,
): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    'grains',
    new NodeEnvironment(options),
  );
}

export { calculateGrains, GrainsInputSchema };
export type { GrainsInput, GrainsInputTransformed, GrainsOutput };
