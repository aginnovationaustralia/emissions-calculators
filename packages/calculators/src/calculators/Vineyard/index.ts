import { AllConstants } from '../../constants/types';
import { VineyardInput, VineyardInputSchema, VineyardOutput } from '../../types/Vineyard';
import { CalculatorNames } from '../browser';
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
    CalculatorNames.Vineyard,
    new NodeEnvironment(options),
  );
}

export { VineyardInputSchema, calculateVineyard };
export type { AllConstants, VineyardInput, VineyardOutput };

