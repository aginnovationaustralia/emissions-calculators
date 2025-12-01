import { AllConstants } from '../../constants/types';
import { BuffaloInput, BuffaloInputSchema, BuffaloOutput } from '../../types/Buffalo';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateBuffalo as calculateBuffaloInternal } from './calculator';
export * from '../../types/Buffalo';

function calculateBuffalo(
  input: BuffaloInput,
  options?: CalculatorOptions,
): BuffaloOutput {
  return executeCalculator(
    calculateBuffaloInternal,
    input,
    'buffalo',
    new BrowserEnvironment(options),
  );
}

export { BuffaloInputSchema, calculateBuffalo };
export type { AllConstants, BuffaloInput, BuffaloOutput };

