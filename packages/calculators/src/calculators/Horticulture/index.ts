import { AllConstants } from '../../constants/types';
import { HorticultureInput, HorticultureInputSchema, HorticultureOutput } from '../../types/Horticulture';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateHorticulture as calculateHorticultureInternal } from './calculator';
export * from '../../types/Horticulture';

function calculateHorticulture(
  input: HorticultureInput,
  options?: CalculatorOptions,
): HorticultureOutput {
  return executeCalculator(
    calculateHorticultureInternal,
    input,
    'horticulture',
    new NodeEnvironment(options),
  );
}

export { HorticultureInputSchema, calculateHorticulture };
export type { AllConstants, HorticultureInput, HorticultureOutput };

