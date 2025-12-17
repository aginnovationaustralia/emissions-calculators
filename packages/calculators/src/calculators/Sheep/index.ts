import { AllConstants } from '../../constants/types';
import { SheepInput, SheepInputSchema, SheepOutput } from '../../types/Sheep';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    new NodeEnvironment(options),
  );
}

export { SheepInputSchema, calculateSheep };
export type { AllConstants, SheepInput, SheepOutput };

