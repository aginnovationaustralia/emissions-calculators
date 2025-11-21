import { AllConstants } from '../../constants/types';
import { WildCatchFisheryInput, WildCatchFisheryInputSchema, WildCatchFisheryOutput } from '../../types/WildCatchFishery';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    CalculatorNames.WildCatchFishery,
    new NodeEnvironment(options),
  );
}

export { WildCatchFisheryInputSchema, calculateWildCatchFishery };
export type { AllConstants, WildCatchFisheryInput, WildCatchFisheryOutput };

