import { AllConstants } from '../../constants/types';
import { DeerInput, DeerInputSchema, DeerOutput } from '../../types/Deer';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateDeer as calculateDeerInternal } from './calculator';
export * from '../../types/Deer';

function calculateDeer(
  input: DeerInput,
  options?: CalculatorOptions,
): DeerOutput {
  return executeCalculator(
    calculateDeerInternal,
    input,
    CalculatorNames.Deer,
    new BrowserEnvironment(options),
  );
}

export { DeerInputSchema, calculateDeer };
export type { AllConstants, DeerInput, DeerOutput };

