import {
  OtherLivestockInput,
  OtherLivestockInputSchema,
  calculateOtherLivestockParsed,
} from '@aginnovationaustralia/emissions-calculators/other-livestock';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import {
  otherLivestockInputDataMethod1,
  otherLivestockInputDataMethod2,
} from './input';

const calculate = (input: OtherLivestockInput) => {
  const validatedInput = validateCalculatorInput(
    OtherLivestockInputSchema,
    input,
  );

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateOtherLivestockParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate other livestock emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Other livestock emissions for the method 1 and method 2 inputs
 */
export const calculateOtherLivestockNestedExport = () => {
  const method1 = calculate(otherLivestockInputDataMethod1);
  console.log(
    'Other livestock (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(otherLivestockInputDataMethod2);
  console.log(
    'Other livestock (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
