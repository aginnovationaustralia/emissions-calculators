import { AllConstants } from '../../constants/types';
import { FeedlotInput, FeedlotInputSchema, FeedlotOutput } from '../../types/Feedlot';
import { executeCalculator } from '../execution/execute';
import { NodeEnvironment } from '../execution/node/environment';
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
    'feedlot',
    new NodeEnvironment(options),
  );
}

export { FeedlotInputSchema, calculateFeedlot };
export type { AllConstants, FeedlotInput, FeedlotOutput };

