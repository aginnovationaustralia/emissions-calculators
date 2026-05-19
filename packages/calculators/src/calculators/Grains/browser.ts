import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../executionContext';
import { calculateGrains as calculateGrainsInternal } from './calculator';
import { GrainsOutput } from './types';
import {
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from './types/input';

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
