import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateSheep as calculateSheepInternal } from './calculator';
import {
  SheepInput,
  SheepInputSchema,
  SheepInputTransformed,
  SheepOutput,
} from './types';

function calculateSheepParsed(
  input: SheepInputTransformed,
  options?: CalculatorOptions,
): SheepOutput {
  return executeCalculator(
    calculateSheepInternal,
    input,
    'sheep',
    new NodeEnvironment(options),
  );
}

function calculateSheep(input: SheepInput, options?: CalculatorOptions) {
  return tryCalculate(SheepInputSchema, input, calculateSheepParsed, options);
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
export type { SheepFlockInput } from './types/sheep-flock.input';
export { calculateSheep, calculateSheepParsed, SheepInputSchema };
export type { SheepInput, SheepInputTransformed, SheepOutput };
