import {
  calculateCotton,
  calculateCottonParsed,
  CottonInput,
  CottonInputSchema,
} from '@aginnovationaustralia/emissions-calculators/cotton';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { cottonInputDataMethod1, cottonInputDataMethod2 } from './input';

const performValidationAndCalculate = (input: CottonInput) => {
  const validatedInput = validateCalculatorInput(CottonInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateCottonParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate cotton emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Cotton emissions for the method 1 and method 2 inputs
 */
export const validateAndCalculateCottonNestedExport = () => {
  const method1 = performValidationAndCalculate(cottonInputDataMethod1);
  console.log('Cotton (method 1) emissions calculated correctly', method1.net);

  const method2 = performValidationAndCalculate(cottonInputDataMethod2);
  console.log('Cotton (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};

/**
 * Pass user input directly into the calculateCotton function. This can either reject the input as invalid, perform the calculation, or fail with an error.
 * The status of the result object allows you to check which scenario happened.
 */
export const calculateCottonNestedExport = () => {
  const method1 = calculateCotton(cottonInputDataMethod1);
  const method2 = calculateCotton(cottonInputDataMethod2);

  if (method1.status === 'ERROR') {
    console.log(
      'The calculation for method 1 failed: ' + method1.error.message,
    );
  }

  if (method2.status === 'ERROR') {
    console.log(
      'The calculation for method 2 failed: ' + method2.error.message,
    );
  }

  return { method1, method2 };
};
