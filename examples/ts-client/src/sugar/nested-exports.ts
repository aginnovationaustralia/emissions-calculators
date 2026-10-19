import {
  calculateSugarParsed,
  SugarInput,
  SugarInputSchema,
} from '@aginnovationaustralia/emissions-calculators/sugar';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { sugarInputDataMethod1, sugarInputDataMethod2 } from './input';

const calculate = (input: SugarInput) => {
  const validatedInput = validateCalculatorInput(SugarInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateSugarParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate sugar emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Sugar emissions for the method 1 and method 2 inputs
 */
export const calculateSugarNestedExport = () => {
  const method1 = calculate(sugarInputDataMethod1);
  console.log('Sugar (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(sugarInputDataMethod2);
  console.log('Sugar (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
