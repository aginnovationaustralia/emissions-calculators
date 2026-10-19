import {
  FeedlotInput,
  FeedlotInputSchema,
  calculateFeedlotParsed,
} from '@aginnovationaustralia/emissions-calculators/feedlot';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { feedlotInputDataMethod1, feedlotInputDataMethod2 } from './input';

const calculate = (input: FeedlotInput) => {
  const validatedInput = validateCalculatorInput(FeedlotInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateFeedlotParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate feedlot emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Feedlot emissions for the method 1 and method 2 inputs
 */
export const calculateFeedlotNestedExport = () => {
  const method1 = calculate(feedlotInputDataMethod1);
  console.log('Feedlot (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(feedlotInputDataMethod2);
  console.log('Feedlot (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
