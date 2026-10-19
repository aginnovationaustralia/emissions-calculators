import {
  PoultryInput,
  PoultryInputSchema,
  calculatePoultryParsed,
} from '@aginnovationaustralia/emissions-calculators/poultry';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { poultryInputDataMethod1, poultryInputDataMethod2 } from './input';

const calculate = (input: PoultryInput) => {
  const validatedInput = validateCalculatorInput(PoultryInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculatePoultryParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate poultry emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Poultry emissions for the method 1 and method 2 inputs
 */
export const calculatePoultryNestedExport = () => {
  const method1 = calculate(poultryInputDataMethod1);
  console.log('Poultry (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(poultryInputDataMethod2);
  console.log('Poultry (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
