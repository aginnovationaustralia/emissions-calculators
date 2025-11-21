import { AllConstants } from '../../constants/types';
import { FeedlotInput, FeedlotInputSchema, FeedlotOutput } from '../../types/Feedlot';
import { CalculatorNames } from '../browser';
import { BrowserEnvironment } from '../execution/browser/environment';
import { executeCalculator } from '../execution/execute';
import { CalculatorOptions } from '../execution/types';
import { calculateEntireFeedlot as calculateEntireFeedlotInternal } from './calculator';
export * from '../../types/Feedlot';

function calculateFeedlot(
  input: FeedlotInput,
  options?: CalculatorOptions,
): FeedlotOutput {
  return executeCalculator(
    calculateEntireFeedlotInternal,
    input,
    CalculatorNames.Feedlot,
    new BrowserEnvironment(options),
  );
}

export { FeedlotInputSchema, calculateFeedlot };
export type { AllConstants, FeedlotInput, FeedlotOutput };

