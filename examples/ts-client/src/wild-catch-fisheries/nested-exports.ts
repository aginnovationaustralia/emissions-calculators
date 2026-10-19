import {
  WildCatchFisheriesInput,
  WildCatchFisheriesInputSchema,
  calculateWildCatchFisheriesParsed,
} from '@aginnovationaustralia/emissions-calculators/wild-catch-fisheries';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import {
  wildCatchFisheriesInputDataMethod1,
  wildCatchFisheriesInputDataMethod2,
} from './input';

const calculate = (input: WildCatchFisheriesInput) => {
  const validatedInput = validateCalculatorInput(
    WildCatchFisheriesInputSchema,
    input,
  );

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateWildCatchFisheriesParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate wild catch fisheries emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Wild catch fisheries emissions for the method 1 and method 2 inputs
 */
export const calculateWildCatchFisheriesNestedExport = () => {
  const method1 = calculate(wildCatchFisheriesInputDataMethod1);
  console.log(
    'Wild catch fisheries (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(wildCatchFisheriesInputDataMethod2);
  console.log(
    'Wild catch fisheries (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
