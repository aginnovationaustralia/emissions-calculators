import {
  calculateViticultureParsed,
  ViticultureInput,
  ViticultureInputSchema,
} from '@aginnovationaustralia/emissions-calculators/viticulture';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import {
  viticultureInputDataMethod1,
  viticultureInputDataMethod2,
} from './input';

const calculate = (input: ViticultureInput) => {
  const validatedInput = validateCalculatorInput(ViticultureInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateViticultureParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate viticulture emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Viticulture emissions for the method 1 and method 2 inputs
 */
export const calculateViticultureNestedExport = () => {
  const method1 = calculate(viticultureInputDataMethod1);
  console.log(
    'Viticulture (method 1) emissions calculated correctly',
    method1.net,
  );

  const method2 = calculate(viticultureInputDataMethod2);
  console.log(
    'Viticulture (method 2) emissions calculated correctly',
    method2.net,
  );

  return { method1, method2 };
};
