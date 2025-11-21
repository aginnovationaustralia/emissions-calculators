import { AllConstants } from '../../constants/types';
import { VineyardInput, VineyardInputSchema, VineyardOutput } from '../../types/Vineyard';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
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
    new BrowserEnvironment(options),
  );
}

export { VineyardInputSchema, calculateVineyard };
export type { AllConstants, VineyardInput, VineyardOutput };

