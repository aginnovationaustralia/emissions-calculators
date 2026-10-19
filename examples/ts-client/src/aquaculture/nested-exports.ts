import {
  AquacultureInput,
  AquacultureInputSchema,
  calculateAquacultureParsed,
} from '@aginnovationaustralia/emissions-calculators/aquaculture';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import {
  aquacultureInputDataMethod1,
  aquacultureInputDataMethod2,
} from './input';

const calculate = (input: AquacultureInput) => {
  const validatedInput = validateCalculatorInput(AquacultureInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateAquacultureParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate aquaculture emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Aquaculture emissions for the method 1 and method 2 inputs
 */
export const calculateAquacultureNestedExport = () => {
  const method1 = calculate(aquacultureInputDataMethod1);
  console.log(
    'Aquaculture (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(aquacultureInputDataMethod2);
  console.log(
    'Aquaculture (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
