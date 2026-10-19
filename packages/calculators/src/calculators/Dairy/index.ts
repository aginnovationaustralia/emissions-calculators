import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateDairy as calculateDairyInternal } from './calculator';
import {
  DairyInput,
  DairyInputSchema,
  DairyInputTransformed,
  DairyOutput,
} from './types';

function calculateDairyParsed(
  input: DairyInputTransformed,
  options?: CalculatorOptions,
): DairyOutput {
  return executeCalculator(
    calculateDairyInternal,
    input,
    'dairy',
    new NodeEnvironment(options),
  );
}

function calculateDairy(input: DairyInput, options?: CalculatorOptions) {
  return tryCalculate(DairyInputSchema, input, calculateDairyParsed, options);
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
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/residues';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export type { DairyHerdInput } from './types/herd.input';
export { calculateDairy, calculateDairyParsed, DairyInputSchema };
export type { DairyInput, DairyInputTransformed, DairyOutput };
