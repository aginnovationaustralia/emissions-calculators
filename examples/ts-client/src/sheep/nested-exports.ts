import {
  SheepInput,
  SheepInputSchema,
  calculateSheepParsed,
} from '@aginnovationaustralia/emissions-calculators/sheep';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { sheepInputDataMethod1, sheepInputDataMethod2 } from './input';

const calculate = (input: SheepInput) => {
  const validatedInput = validateCalculatorInput(SheepInputSchema, input);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  return calculateSheepParsed(validatedInput.result, {
    disableMetrics: true,
  });
};

/**
 * Calculate sheep emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * The inputs are built up from individually typed pieces, see `./input.ts`. One uses only method 1 inputs, the other
 * uses method 2 inputs wherever they are available.
 *
 * @returns Sheep emissions for the method 1 and method 2 inputs
 */
export const calculateSheepNestedExport = () => {
  const method1 = calculate(sheepInputDataMethod1);
  console.log('Sheep (method 1) emissions calculated correctly', method1.net);

  const method2 = calculate(sheepInputDataMethod2);
  console.log('Sheep (method 2) emissions calculated correctly', method2.net);

  return { method1, method2 };
};
