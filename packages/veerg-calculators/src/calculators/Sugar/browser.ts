import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateSugar as calculateSugarInternal } from './calculator';
import { SugarOutput } from './types';
import {
  SugarInput,
  SugarInputSchema,
  SugarInputTransformed,
} from './types/input';

function calculateSugarParsed(
  input: SugarInputTransformed,
  options?: CalculatorOptions,
): SugarOutput {
  return executeCalculator(
    calculateSugarInternal,
    input,
    'sugar',
    new BrowserEnvironment(options),
  );
}

function calculateSugar(input: SugarInput, options?: CalculatorOptions) {
  return tryCalculate(SugarInputSchema, input, calculateSugarParsed, options);
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
export { calculateSugar, calculateSugarParsed, SugarInputSchema };
export type { AllConstants, SugarInput, SugarInputTransformed, SugarOutput };
