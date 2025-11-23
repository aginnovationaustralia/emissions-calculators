import { AllConstants } from '../../constants/types';
import { AquacultureInput, AquacultureInputSchema, AquacultureOutput } from '../../types/Aquaculture';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateAquaculture as calculateAquacultureInternal } from './calculator';
export * from '../../types/Aquaculture';

function calculateAquaculture(
  input: AquacultureInput,
  options?: CalculatorOptions,
): AquacultureOutput {
  return executeCalculator(
    calculateAquacultureInternal,
    input,
    CalculatorNames.Aquaculture,
    new NodeEnvironment(options),
  );
}

export { AquacultureInputSchema, calculateAquaculture };
export type { AllConstants, AquacultureInput, AquacultureOutput };

