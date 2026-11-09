import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateRice as calculateRiceInternal } from './calculator';
import { RiceOutput } from './types';
import {
  RiceInput,
  RiceInputSchema,
  RiceInputTransformed,
} from './types/input';

function calculateRiceParsed(
  input: RiceInputTransformed,
  options?: CalculatorOptions,
): RiceOutput {
  return executeCalculator(
    calculateRiceInternal,
    input,
    'rice',
    new BrowserEnvironment(options),
  );
}

function calculateRice(input: RiceInput, options?: CalculatorOptions) {
  return tryCalculate(RiceInputSchema, input, calculateRiceParsed, options);
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
export { calculateRice, calculateRiceParsed, RiceInputSchema };
export type { AllConstants, RiceInput, RiceInputTransformed, RiceOutput };
