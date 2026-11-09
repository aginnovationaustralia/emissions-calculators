import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateWildCatchFisheries as calculateWildCatchFisheriesInternal } from './calculator';
import {
  WildCatchFisheriesInput,
  WildCatchFisheriesInputSchema,
  WildCatchFisheriesInputTransformed,
  WildCatchFisheriesOutput,
} from './types';

function calculateWildCatchFisheriesParsed(
  input: WildCatchFisheriesInputTransformed,
  options?: CalculatorOptions,
): WildCatchFisheriesOutput {
  return executeCalculator(
    calculateWildCatchFisheriesInternal,
    input,
    'wild-catch-fisheries',
    new BrowserEnvironment(options),
  );
}

function calculateWildCatchFisheries(
  input: WildCatchFisheriesInput,
  options?: CalculatorOptions,
) {
  return tryCalculate(
    WildCatchFisheriesInputSchema,
    input,
    calculateWildCatchFisheriesParsed,
    options,
  );
}

export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/purchased-feed';
export type * from '../types/input-creation/refrigerants';
export type * from '../types/input-creation/solid-waste';
export type * from '../types/input-creation/wastewater';
export type { WildCatchFisheryInput } from './types/wild-catch-fishery.input';
export {
  calculateWildCatchFisheries,
  calculateWildCatchFisheriesParsed,
  WildCatchFisheriesInputSchema,
};
export type {
  AllConstants,
  WildCatchFisheriesInput,
  WildCatchFisheriesInputTransformed,
  WildCatchFisheriesOutput,
};
