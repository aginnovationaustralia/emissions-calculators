import {
  PigsInput,
  PigsInputSchema,
  calculatePigsParsed,
} from '@aginnovationaustralia/emissions-calculators/pigs';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { pigsInputDataMethod1, pigsInputDataMethod2 } from './input';

const calculate = (input: PigsInput) => {
  const validatedInput = validateCalculatorInput(PigsInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculatePigsParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate pigs emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Pigs emissions for the method 1 and method 2 inputs
 */
export const calculatePigsNestedExport = () => {
  const method1 = calculate(pigsInputDataMethod1);
  console.log('Pigs (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(pigsInputDataMethod2);
  console.log('Pigs (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
