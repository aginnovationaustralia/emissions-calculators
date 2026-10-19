import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculatePoultry as calculatePoultryInternal } from './calculator';
import {
  PoultryInput,
  PoultryInputSchema,
  PoultryInputTransformed,
  PoultryOutput,
} from './types';

function calculatePoultryParsed(
  input: PoultryInputTransformed,
  options?: CalculatorOptions,
): PoultryOutput {
  return executeCalculator(
    calculatePoultryInternal,
    input,
    'poultry',
    new BrowserEnvironment(options),
  );
}

function calculatePoultry(input: PoultryInput, options?: CalculatorOptions) {
  return tryCalculate(
    PoultryInputSchema,
    input,
    calculatePoultryParsed,
    options,
  );
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
export type { PoultryFlockInput } from './types/poultry-flock.input';
export { calculatePoultry, calculatePoultryParsed, PoultryInputSchema };
export type {
  AllConstants,
  PoultryInput,
  PoultryInputTransformed,
  PoultryOutput,
};
