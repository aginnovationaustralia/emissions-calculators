import {
  calculateRiceParsed,
  RiceInput,
  RiceInputSchema,
} from '@aginnovationaustralia/emissions-calculators/rice';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { riceInputDataMethod1, riceInputDataMethod2 } from './input';

const calculate = (input: RiceInput) => {
  const validatedInput = validateCalculatorInput(RiceInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateRiceParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate rice emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Rice emissions for the method 1 and method 2 inputs
 */
export const calculateRiceNestedExport = () => {
  const method1 = calculate(riceInputDataMethod1);
  console.log('Rice (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(riceInputDataMethod2);
  console.log('Rice (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
