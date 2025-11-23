import { AllConstants } from '../../constants/types';
import { RiceInput, RiceInputSchema, RiceOutput } from '../../types/Rice';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    CalculatorNames.Rice,
    new NodeEnvironment(options),
  );
}

export { RiceInputSchema, calculateRice };
export type { AllConstants, RiceInput, RiceOutput };

