import {
  calculateGrainsParsed,
  GrainsInput,
  GrainsInputSchema,
} from '@aginnovationaustralia/emissions-calculators/grains';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { grainsInputDataMethod1, grainsInputDataMethod2 } from './input';

const calculate = (input: GrainsInput) => {
  const validatedInput = validateCalculatorInput(GrainsInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateGrainsParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate grains emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Grains emissions for the method 1 and method 2 inputs
 */
export const calculateGrainsNestedExport = () => {
  const method1 = calculate(grainsInputDataMethod1);
  console.log('Grains (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(grainsInputDataMethod2);
  console.log('Grains (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
