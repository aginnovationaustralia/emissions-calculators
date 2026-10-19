import {
  DairyInput,
  DairyInputSchema,
  calculateDairyParsed,
} from '@aginnovationaustralia/emissions-calculators/dairy';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { dairyInputDataMethod1, dairyInputDataMethod2 } from './input';

const calculate = (input: DairyInput) => {
  const validatedInput = validateCalculatorInput(DairyInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateDairyParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate dairy emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Dairy emissions for the method 1 and method 2 inputs
 */
export const calculateDairyNestedExport = () => {
  const method1 = calculate(dairyInputDataMethod1);
  console.log('Dairy (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(dairyInputDataMethod2);
  console.log('Dairy (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
