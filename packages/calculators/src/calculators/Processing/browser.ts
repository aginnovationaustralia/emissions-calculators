import { AllConstants } from '../../constants/types';
import { ProcessingInput, ProcessingInputSchema, ProcessingOutput } from '../../types/Processing';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateProcessing as calculateProcessingInternal } from './calculator';
export * from '../../types/Processing';

function calculateProcessing(
  input: ProcessingInput,
  options?: CalculatorOptions,
): ProcessingOutput {
  return executeCalculator(
    calculateProcessingInternal,
    input,
    CalculatorNames.Processing,
    new BrowserEnvironment(options),
  );
}

export { ProcessingInputSchema, calculateProcessing };
export type { AllConstants, ProcessingInput, ProcessingOutput };

