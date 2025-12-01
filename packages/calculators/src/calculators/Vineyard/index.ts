import { AllConstants } from '../../constants/types';
import { VineyardInput, VineyardInputSchema, VineyardOutput } from '../../types/Vineyard';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateVineyard as calculateVineyardInternal } from './calculator';
export * from '../../types/Vineyard';

function calculateVineyard(
  input: VineyardInput,
  options?: CalculatorOptions,
): VineyardOutput {
  return executeCalculator(
    calculateVineyardInternal,
    input,
    'vineyard',
    new NodeEnvironment(options),
  );
}

export { VineyardInputSchema, calculateVineyard };
export type { AllConstants, VineyardInput, VineyardOutput };

