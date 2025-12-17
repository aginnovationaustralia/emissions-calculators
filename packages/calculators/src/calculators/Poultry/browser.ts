import { AllConstants } from '../../constants/types';
import { PoultryInput, PoultryInputSchema, PoultryOutput } from '../../types/Poultry';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculatePoultry as calculatePoultryInternal } from './calculator';
export * from '../../types/Poultry';

function calculatePoultry(
  input: PoultryInput,
  options?: CalculatorOptions,
): PoultryOutput {
  return executeCalculator(
    calculatePoultryInternal,
    input,
    'poultry',
    new BrowserEnvironment(options),
  );
}

export { PoultryInputSchema, calculatePoultry };
export type { AllConstants, PoultryInput, PoultryOutput };

