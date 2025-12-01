import { AllConstants } from '../../constants/types';
import { GrainsInput, GrainsInputSchema, GrainsOutput } from '../../types/Grains';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateGrains as calculateGrainsInternal } from './calculator';
export * from '../../types/Grains';

function calculateGrains(
  input: GrainsInput,
  options?: CalculatorOptions,
): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    'grains',
    new NodeEnvironment(options),
  );
}

export { GrainsInputSchema, calculateGrains };
export type { AllConstants, GrainsInput, GrainsOutput };

