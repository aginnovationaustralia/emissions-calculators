import { AllConstants } from '../../constants/types';
import { RiceInput, RiceInputSchema, RiceOutput } from '../../types/Rice';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateRice as calculateRiceInternal } from './calculator';
export * from '../../types/Rice';

function calculateRice(
  input: RiceInput,
  options?: CalculatorOptions,
): RiceOutput {
  return executeCalculator(
    calculateRiceInternal,
    input,
    'rice',
    new BrowserEnvironment(options),
  );
}

export { RiceInputSchema, calculateRice };
export type { AllConstants, RiceInput, RiceOutput };

