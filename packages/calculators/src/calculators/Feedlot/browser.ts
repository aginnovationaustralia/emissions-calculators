import { tryCalculate } from '@/calculate';
import { AllConstants } from '../../constants/types';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateFeedlot as calculateFeedlotInternal } from './calculator';
import {
  FeedlotInput,
  FeedlotInputSchema,
  FeedlotInputTransformed,
  FeedlotOutput,
} from './types';

function calculateFeedlotParsed(
  input: FeedlotInputTransformed,
  options?: CalculatorOptions,
): FeedlotOutput {
  return executeCalculator(
    calculateFeedlotInternal,
    input,
    'feedlot',
    new BrowserEnvironment(options),
  );
}

function calculateFeedlot(input: FeedlotInput, options?: CalculatorOptions) {
  return tryCalculate(
    FeedlotInputSchema,
    input,
    calculateFeedlotParsed,
    options,
  );
}

export type * from '../types/input-creation/common';
export type * from '../types/input-creation/electricity';
export type * from '../types/input-creation/fuel';
export type * from '../types/input-creation/land-use';
export type * from '../types/input-creation/mineral-supplements';
export type * from '../types/input-creation/other-purchases';
export type * from '../types/input-creation/purchased-feed';
export type * from '../types/input-creation/purchased-livestock';
export type * from '../types/input-creation/services';
export type * from '../types/input-creation/solid-waste';
export type * from './types/input-creation';
export type { FeedlotLotInput } from './types/feedlot-lot.input';
export { calculateFeedlot, calculateFeedlotParsed, FeedlotInputSchema };
export type {
  AllConstants,
  FeedlotInput,
  FeedlotInputTransformed,
  FeedlotOutput,
};
