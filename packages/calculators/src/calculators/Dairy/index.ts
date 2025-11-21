import { AllConstants } from '../../constants/types';
import { DairyInput, DairyInputSchema, DairyOutput } from '../../types/Dairy';
import { CalculatorNames } from '../browser';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { calculateDairy as calculateDairyInternal } from './calculator';
export * from '../../types/Dairy';

function calculateDairy(
  input: DairyInput,
  options?: CalculatorOptions,
): DairyOutput {
  return executeCalculator(
    calculateDairyInternal,
    input,
    CalculatorNames.Dairy,
    new NodeEnvironment(options),
  );
}

export { DairyInputSchema, calculateDairy };
export type { AllConstants, DairyInput, DairyOutput };

