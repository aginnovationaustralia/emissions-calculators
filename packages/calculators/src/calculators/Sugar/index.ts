import { AllConstants } from '../../constants/types';
import { SugarInput, SugarInputSchema, SugarOutput } from '../../types/Sugar';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    'sugar',
    new NodeEnvironment(options),
  );
}

export { SugarInputSchema, calculateSugar };
export type { AllConstants, SugarInput, SugarOutput };

