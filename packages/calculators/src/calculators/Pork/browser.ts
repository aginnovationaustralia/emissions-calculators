import { AllConstants } from '../../constants/types';
import { PorkInput, PorkInputSchema, PorkOutput } from '../../types/Pork';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculatePork as calculatePorkInternal } from './calculator';
export * from '../../types/Pork';

function calculatePork(
  input: PorkInput,
  options?: CalculatorOptions,
): PorkOutput {
  return executeCalculator(
    calculatePorkInternal,
    input,
    'pork',
    new BrowserEnvironment(options),
  );
}

export { PorkInputSchema, calculatePork };
export type { AllConstants, PorkInput, PorkOutput };

