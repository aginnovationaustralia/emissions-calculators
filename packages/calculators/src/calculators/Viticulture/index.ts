import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateViticulture as calculateViticultureInternal } from './calculator';
import {
  ViticultureOutput,
  ViticultureInput,
  ViticultureInputSchema,
  ViticultureInputTransformed,
} from './types';

function calculateViticultureParsed(
  input: ViticultureInputTransformed,
  options?: CalculatorOptions,
): ViticultureOutput {
  return executeCalculator(
    calculateViticultureInternal,
    input,
    'viticulture',
    new NodeEnvironment(options),
  );
}

function calculateViticulture(
  input: ViticultureInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    ViticultureInputSchema,
    input,
    calculateViticultureParsed,
    options,
  );
}

export type * from '../types/input-creation/agrichemicals';
export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fertiliser';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/lime';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/residues';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export {
  calculateViticulture,
  calculateViticultureParsed,
  ViticultureInputSchema,
};
export type {
  ViticultureInput,
  ViticultureInputTransformed,
  ViticultureOutput,
};
