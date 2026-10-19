import { tryCalculate } from '@/calculate';
import { NodeEnvironment } from '../execution/node/environment';
import { CalculatorOptions } from '../execution/types';
import { executeCalculator } from '../execution/execute';
import { calculateAquaculture as calculateAquacultureInternal } from './calculator';
import {
  AquacultureInput,
  AquacultureInputSchema,
  AquacultureInputTransformed,
  AquacultureOutput,
} from './types';

function calculateAquacultureParsed(
  input: AquacultureInputTransformed,
  options?: CalculatorOptions,
): AquacultureOutput {
  return executeCalculator(
    calculateAquacultureInternal,
    input,
    'aquaculture',
    new NodeEnvironment(options),
  );
}

function calculateAquaculture(
  input: AquacultureInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    AquacultureInputSchema,
    input,
    calculateAquacultureParsed,
    options,
  );
}

export type * from '../types/input-creation/aquaculture-system';
export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/purchased-feed';
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/solid-waste';
export type * from '../types/input-creation/wastewater';
export type { AquacultureFisheryInput } from './types/aquaculture-fishery.input';
export {
  calculateAquaculture,
  calculateAquacultureParsed,
  AquacultureInputSchema,
};
export type {
  AquacultureInput,
  AquacultureInputTransformed,
  AquacultureOutput,
};
