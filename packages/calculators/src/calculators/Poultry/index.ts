import { AllConstants } from '../../constants/types';
import { PoultryInput, PoultryInputSchema, PoultryOutput } from '../../types/Poultry';
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
    'poultry',
    new NodeEnvironment(options),
  );
}

export { PoultryInputSchema, calculatePoultry };
export type { AllConstants, PoultryInput, PoultryOutput };

