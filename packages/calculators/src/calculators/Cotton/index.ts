import { AllConstants } from '../../constants/types';
import { CottonInput, CottonInputSchema, CottonOutput } from '../../types/Cotton';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    'cotton',
    new NodeEnvironment(options),
  );
}

export { CottonInputSchema, calculateCotton };
export type { AllConstants, CottonInput, CottonOutput };

