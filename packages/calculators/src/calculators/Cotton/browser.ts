import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateCotton as calculateCottonInternal } from './calculator';
import { CottonOutput } from './types';
import {
  CottonInput,
  CottonInputSchema,
  CottonInputTransformed,
} from './types/input';

function calculateCottonParsed(
  input: CottonInputTransformed,
  options?: CalculatorOptions,
): CottonOutput {
  return executeCalculator(
    calculateCottonInternal,
    input,
    'cotton',
    new BrowserEnvironment(options),
  );
}

function calculateCotton(input: CottonInput, options?: CalculatorOptions) {
  return tryCalculate(CottonInputSchema, input, calculateCottonParsed, options);
}

export type * from '../types/input-creation/agrichemicals';
export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fertiliser';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/lime';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/residues';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export { calculateCotton, calculateCottonParsed, CottonInputSchema };
export type { AllConstants, CottonInput, CottonInputTransformed, CottonOutput };
