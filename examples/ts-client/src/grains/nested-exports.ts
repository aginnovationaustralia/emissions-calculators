import {
  GrainsInputSchema,
  calculateGrains,
} from '@aginnovationaustralia/emissions-calculators/grains';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { grainsInputData } from './input';

/**
 * Calculate beef emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * Avoid top level exports to prevent a bundler pulling in the implementation and schemas for all calculators.
 *
 * @returns Beef emissions
 */
export const calculateGrainsNestedExport = () => {
  const validatedInput = validateCalculatorInput(
    GrainsInputSchema,
    grainsInputData,
  );

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  const result = calculateGrains(validatedInput.result, {
    disableMetrics: true,
  });
  return result;
};
