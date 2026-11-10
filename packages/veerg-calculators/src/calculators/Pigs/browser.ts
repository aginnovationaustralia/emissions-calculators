import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculatePigs as calculatePigsInternal } from './calculator';
import {
  PigsInput,
  PigsInputSchema,
  PigsInputTransformed,
  PigsOutput,
} from './types';

function calculatePigsParsed(
  input: PigsInputTransformed,
  options?: CalculatorOptions,
): PigsOutput {
  return executeCalculator(
    calculatePigsInternal,
    input,
    'pigs',
    new BrowserEnvironment(options),
  );
}

function calculatePigs(input: PigsInput, options?: CalculatorOptions) {
  return tryCalculate(PigsInputSchema, input, calculatePigsParsed, options);
}

export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/purchased-feed';
export type * from '../types/input-creation/purchased-livestock';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export type { PigsHerdInput } from './types/pigs-herd.input';
export { calculatePigs, calculatePigsParsed, PigsInputSchema };
export type { AllConstants, PigsInput, PigsInputTransformed, PigsOutput };
