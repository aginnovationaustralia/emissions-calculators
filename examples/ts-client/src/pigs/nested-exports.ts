import {
  PigsInput,
  PigsInputSchema,
  calculatePigs,
  calculatePigsParsed,
} from '@aginnovationaustralia/emissions-calculators/pigs';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { pigsInputDataMethod1, pigsInputDataMethod2 } from './input';

const performValidationAndCalculate = (input: PigsInput) => {
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
export const validateAndCalculatePigsNestedExport = () => {
  const method1 = performValidationAndCalculate(pigsInputDataMethod1);
  console.log('Pigs (method 1) emissions calculated correctly', method1.net);

  const method2 = performValidationAndCalculate(pigsInputDataMethod2);
  console.log('Pigs (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};

/**
 * Pass user input directly into the calculatePigs function. This can either reject the input as invalid, perform the calculation, or fail with an error.
 * The status of the result object allows you to check which scenario happened.
 */
export const calculatePigsNestedExport = () => {
  const method1 = calculatePigs(pigsInputDataMethod1);
  const method2 = calculatePigs(pigsInputDataMethod2);

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
