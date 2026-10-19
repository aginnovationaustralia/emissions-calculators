import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateOtherLivestock as calculateOtherLivestockInternal } from './calculator';
import {
  OtherLivestockInput,
  OtherLivestockInputSchema,
  OtherLivestockInputTransformed,
  OtherLivestockOutput,
} from './types';

function calculateOtherLivestockParsed(
  input: OtherLivestockInputTransformed,
  options?: CalculatorOptions,
): OtherLivestockOutput {
  return executeCalculator(
    calculateOtherLivestockInternal,
    input,
    'other-livestock',
    new NodeEnvironment(options),
  );
}

function calculateOtherLivestock(
  input: OtherLivestockInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    OtherLivestockInputSchema,
    input,
    calculateOtherLivestockParsed,
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
export type * from '../types/input-creation/mineral-supplements';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/purchased-feed';
export type * from '../types/input-creation/purchased-livestock';
export type * from '../types/input-creation/residues';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export type { OtherLivestockHerdInput } from './types/herd.input';
export {
  calculateOtherLivestock,
  calculateOtherLivestockParsed,
  OtherLivestockInputSchema,
};
export type {
  OtherLivestockInput,
  OtherLivestockInputTransformed,
  OtherLivestockOutput,
};
