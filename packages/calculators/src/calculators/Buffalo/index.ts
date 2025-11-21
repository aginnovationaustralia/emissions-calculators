import { AllConstants } from '../../constants/types';
import { BuffaloInput, BuffaloInputSchema, BuffaloOutput } from '../../types/Buffalo';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateBuffalo as calculateBuffaloInternal } from './calculator';
export * from '../../types/Buffalo';

function calculateBuffalo(
  input: BuffaloInput,
  options?: CalculatorOptions,
): BuffaloOutput {
  return executeCalculator(
    calculateBuffaloInternal,
    input,
    CalculatorNames.Buffalo,
    new NodeEnvironment(options),
  );
}

export { BuffaloInputSchema, calculateBuffalo };
export type { AllConstants, BuffaloInput, BuffaloOutput };

