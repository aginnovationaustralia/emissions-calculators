import {
  ForestryInput,
  ForestryInputSchema,
  calculateForestryParsed,
} from '@aginnovationaustralia/emissions-calculators/forestry';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { forestryInputDataMethod1, forestryInputDataMethod2 } from './input';

const calculate = (input: ForestryInput) => {
  const validatedInput = validateCalculatorInput(ForestryInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateForestryParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate forestry emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Forestry emissions for the method 1 and method 2 inputs
 */
export const calculateForestryNestedExport = () => {
  const method1 = calculate(forestryInputDataMethod1);
  console.log(
    'Forestry (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(forestryInputDataMethod2);
  console.log(
    'Forestry (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
