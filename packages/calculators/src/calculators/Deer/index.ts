import { AllConstants } from '../../constants/types';
import { DeerInput, DeerInputSchema, DeerOutput } from '../../types/Deer';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    new NodeEnvironment(options),
  );
}

export { DeerInputSchema, calculateDeer };
export type { AllConstants, DeerInput, DeerOutput };

