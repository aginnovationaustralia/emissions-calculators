import { AllConstants } from '../../constants/types';
import { AquacultureInput, AquacultureInputSchema, AquacultureOutput } from '../../types/Aquaculture';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
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
    'aquaculture',
    new BrowserEnvironment(options),
  );
}

export { AquacultureInputSchema, calculateAquaculture };
export type { AllConstants, AquacultureInput, AquacultureOutput };

