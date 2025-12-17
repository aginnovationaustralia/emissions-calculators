import { AllConstants } from '../../constants/types';
import { BeefInput, BeefInputSchema, BeefOutput } from '../../types/Beef';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateBeef as calculateBeefInternal } from './calculator';
export * from '../../types/Beef';

function calculateBeef(
  input: BeefInput,
  options?: CalculatorOptions,
): BeefOutput {
  return executeCalculator(
    calculateBeefInternal,
    input,
    'beef',
    new NodeEnvironment(options),
  );
}

export { BeefInputSchema, calculateBeef };
export type { AllConstants, BeefInput, BeefOutput };
