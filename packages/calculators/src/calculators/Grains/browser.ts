import { AllConstants } from '../../constants/types';
import { GrainsInput, GrainsInputSchema, GrainsOutput } from '../../types/Grains';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
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
    new BrowserEnvironment(options),
  );
}

export { GrainsInputSchema, calculateGrains };
export type { AllConstants, GrainsInput, GrainsOutput };

