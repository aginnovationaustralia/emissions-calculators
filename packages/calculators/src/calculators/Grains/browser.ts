import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateGrains as calculateGrainsInternal } from './calculator';
import { executeCalculator } from './constants/executionContext';
import { AllConstants } from './constants/types';
import { GrainsOutput } from './types';
import {
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from './types/input';
export * from '../../types/Grains';

function calculateGrains(
  input: GrainsInputTransformed,
  options?: CalculatorOptions,
): GrainsOutput {
  return executeCalculator(
    calculateGrainsInternal,
    input,
    'grains',
    new BrowserEnvironment(options),
  );
}

export { calculateGrains, GrainsInputSchema };
export type { AllConstants, GrainsInput, GrainsOutput };
