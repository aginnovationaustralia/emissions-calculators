import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculatePostProduction as calculatePostProductionInternal } from './calculator';
import {
  PostProductionInput,
  PostProductionInputSchema,
  PostProductionInputTransformed,
  PostProductionOutput,
} from './types';

function calculatePostProductionParsed(
  input: PostProductionInputTransformed,
  options?: CalculatorOptions,
): PostProductionOutput {
  return executeCalculator(
    calculatePostProductionInternal,
    input,
    'post-production',
    new NodeEnvironment(options),
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
  PostProductionInput,
  PostProductionInputTransformed,
  PostProductionOutput,
};
