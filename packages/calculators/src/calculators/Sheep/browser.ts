import { AllConstants } from '../../constants/types';
import { SheepInput, SheepInputSchema, SheepOutput } from '../../types/Sheep';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateSheep as calculateSheepInternal } from './calculator';
export * from '../../types/Sheep';

function calculateSheep(
  input: SheepInput,
  options?: CalculatorOptions,
): SheepOutput {
  return executeCalculator(
    calculateSheepInternal,
    input,
    'sheep',
    new BrowserEnvironment(options),
  );
}

export { SheepInputSchema, calculateSheep };
export type { AllConstants, SheepInput, SheepOutput };

