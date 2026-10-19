import {
  BeefInput,
  BeefInputSchema,
  calculateBeefParsed,
} from '@aginnovationaustralia/emissions-calculators/beef';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { beefInputDataMethod1, beefInputDataMethod2 } from './input';

const calculate = (input: BeefInput) => {
  const validatedInput = validateCalculatorInput(BeefInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateBeefParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate beef emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Beef emissions for the method 1 and method 2 inputs
 */
export const calculateBeefNestedExport = () => {
  const method1 = calculate(beefInputDataMethod1);
  console.log('Beef (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(beefInputDataMethod2);
  console.log('Beef (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
