import { tryCalculate } from '@/calculate';
import { AllConstants } from '@/constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculatePostProduction as calculatePostProductionInternal } from './calculator';
import {
  PostProductionInput,
  PostProductionInputSchema,
  PostProductionInputTransformed,
} from './types/input';
import { PostProductionOutput } from './types/output';

function calculatePostProductionParsed(
  input: PostProductionInputTransformed,
  options?: CalculatorOptions,
): PostProductionOutput {
  return executeCalculator(
    calculatePostProductionInternal,
    input,
    'post-production',
    new BrowserEnvironment(options),
  );
}

function calculatePostProduction(
  input: PostProductionInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    PostProductionInputSchema,
    input,
    calculatePostProductionParsed,
    options,
  );
}

export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/freight';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/packaging';
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/solid-waste';
export type * from '../types/input-creation/wastewater';
export type { PostProductionIntensitiesInput } from './types/intensities.input';
export {
  calculatePostProduction,
  calculatePostProductionParsed,
  PostProductionInputSchema,
};
export type {
  AllConstants,
  PostProductionInput,
  PostProductionInputTransformed,
  PostProductionOutput,
};
