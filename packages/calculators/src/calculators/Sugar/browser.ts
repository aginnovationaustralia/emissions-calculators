import { AllConstants } from '../../constants/types';
import { SugarInput, SugarInputSchema, SugarOutput } from '../../types/Sugar';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateSugar as calculateSugarInternal } from './calculator';
export * from '../../types/Sugar';

function calculateSugar(
  input: SugarInput,
  options?: CalculatorOptions,
): SugarOutput {
  return executeCalculator(
    calculateSugarInternal,
    input,
    CalculatorNames.Sugar,
    new BrowserEnvironment(options),
  );
}

export { SugarInputSchema, calculateSugar };
export type { AllConstants, SugarInput, SugarOutput };

