import { AllConstants } from '../../constants/types';
import { HorticultureInput, HorticultureInputSchema, HorticultureOutput } from '../../types/Horticulture';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
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
    CalculatorNames.Horticulture,
    new BrowserEnvironment(options),
  );
}

export { HorticultureInputSchema, calculateHorticulture };
export type { AllConstants, HorticultureInput, HorticultureOutput };

