import { AllConstants } from '../../constants/types';
import { CottonInput, CottonInputSchema, CottonOutput } from '../../types/Cotton';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateCotton as calculateCottonInternal } from './calculator';
export * from '../../types/Cotton';

function calculateCotton(
  input: CottonInput,
  options?: CalculatorOptions,
): CottonOutput {
  return executeCalculator(
    calculateCottonInternal,
    input,
    CalculatorNames.Cotton,
    new BrowserEnvironment(options),
  );
}

export { CottonInputSchema, calculateCotton };
export type { AllConstants, CottonInput, CottonOutput };

