import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateForestry as calculateForestryInternal } from './calculator';
import {
  ForestryInput,
  ForestryInputSchema,
  ForestryInputTransformed,
  ForestryOutput,
} from './types';

function calculateForestryParsed(
  input: ForestryInputTransformed,
  options?: CalculatorOptions,
): ForestryOutput {
  return executeCalculator(
    calculateForestryInternal,
    input,
    'forestry',
    new BrowserEnvironment(options),
  );
}

function calculateForestry(input: ForestryInput, options?: CalculatorOptions) {
  return tryCalculate(
    ForestryInputSchema,
    input,
    calculateForestryParsed,
    options,
  );
}

export type * from '../types/input-creation/agrichemicals';
export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fertiliser';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type { ForestryPlantationInput } from './types/plantation.input';
export { calculateForestry, calculateForestryParsed, ForestryInputSchema };
export type {
  AllConstants,
  ForestryInput,
  ForestryInputTransformed,
  ForestryOutput,
};
