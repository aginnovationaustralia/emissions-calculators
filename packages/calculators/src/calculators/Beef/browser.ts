import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateBeef as calculateBeefInternal } from './calculator';
import {
  BeefInput,
  BeefInputSchema,
  BeefInputTransformed,
  BeefOutput,
} from './types';

function calculateBeefParsed(
  input: BeefInputTransformed,
  options?: CalculatorOptions,
): BeefOutput {
  return executeCalculator(
    calculateBeefInternal,
    input,
    'beef',
    new BrowserEnvironment(options),
  );
}

function calculateBeef(input: BeefInput, options?: CalculatorOptions) {
  return tryCalculate(BeefInputSchema, input, calculateBeefParsed, options);
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
export type { BeefHerdInput } from './types/beef-herd.input';
export type * from './types/input-creation';
export { BeefInputSchema, calculateBeef, calculateBeefParsed };
export type { AllConstants, BeefInput, BeefInputTransformed, BeefOutput };
