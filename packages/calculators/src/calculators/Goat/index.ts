import { AllConstants } from '../../constants/types';
import { GoatInput, GoatInputSchema, GoatOutput } from '../../types/Goat';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateGoat as calculateGoatInternal } from './calculator';
export * from '../../types/Goat';

function calculateGoat(
  input: GoatInput,
  options?: CalculatorOptions,
): GoatOutput {
  return executeCalculator(
    calculateGoatInternal,
    input,
    CalculatorNames.Goat,
    new NodeEnvironment(options),
  );
}

export { GoatInputSchema, calculateGoat };
export type { AllConstants, GoatInput, GoatOutput };

