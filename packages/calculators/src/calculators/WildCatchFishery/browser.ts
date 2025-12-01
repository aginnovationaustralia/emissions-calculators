import { AllConstants } from '../../constants/types';
import { WildCatchFisheryInput, WildCatchFisheryInputSchema, WildCatchFisheryOutput } from '../../types/WildCatchFishery';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateWildCatchFishery as calculateWildCatchFisheryInternal } from './calculator';
export * from '../../types/WildCatchFishery';

function calculateWildCatchFishery(
  input: WildCatchFisheryInput,
  options?: CalculatorOptions,
): WildCatchFisheryOutput {
  return executeCalculator(
    calculateWildCatchFisheryInternal,
    input,
    'wildcatchfishery',
    new BrowserEnvironment(options),
  );
}

export { WildCatchFisheryInputSchema, calculateWildCatchFishery };
export type { AllConstants, WildCatchFisheryInput, WildCatchFisheryOutput };

