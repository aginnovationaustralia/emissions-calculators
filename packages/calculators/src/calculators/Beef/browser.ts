import { AllConstants } from '../../constants/types';
import { BeefInput, BeefInputSchema, BeefOutput } from '../../types/Beef';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateBeef as calculateBeefInternal } from './calculator';
export * from '../../types/Beef';

function calculateBeef(
  input: BeefInput,
  options?: CalculatorOptions,
): BeefOutput {
  return executeCalculator(
    calculateBeefInternal,
    input,
    'beef',
    new BrowserEnvironment(options),
  );
}

export { BeefInputSchema, calculateBeef };
export type { AllConstants, BeefInput, BeefOutput };
