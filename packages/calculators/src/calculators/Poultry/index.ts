import { AllConstants } from '../../constants/types';
import { PoultryInput, PoultryInputSchema, PoultryOutput } from '../../types/Poultry';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    CalculatorNames.Poultry,
    new NodeEnvironment(options),
  );
}

export { PoultryInputSchema, calculatePoultry };
export type { AllConstants, PoultryInput, PoultryOutput };

