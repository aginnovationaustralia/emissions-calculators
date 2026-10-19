import {
  PostProductionInput,
  PostProductionInputSchema,
  calculatePostProductionParsed,
} from '@aginnovationaustralia/emissions-calculators/post-production';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import {
  postProductionInputDataMethod1,
  postProductionInputDataMethod2,
} from './input';

const calculate = (input: PostProductionInput) => {
  const validatedInput = validateCalculatorInput(
    PostProductionInputSchema,
    input,
  );

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculatePostProductionParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate post production emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Post production emissions for the method 1 and method 2 inputs
 */
export const calculatePostProductionNestedExport = () => {
  const method1 = calculate(postProductionInputDataMethod1);
  console.log(
    'Post production (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(postProductionInputDataMethod2);
  console.log(
    'Post production (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
