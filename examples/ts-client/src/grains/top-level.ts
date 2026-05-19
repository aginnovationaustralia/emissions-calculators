import {
  calculateGrains,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators';
import {
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from '@aginnovationaustralia/emissions-calculators/grains';
import { ValidationResult } from '@aginnovationaustralia/emissions-calculators/validate';
import { grainsInputData } from './input';

/**
 * Calculate beef emissions using top-level exports, which might be a little easier to discover and start working with.
 * These import paths will be larger due to the inclusion of all calculators and types.
 * @returns Beef emissions
 */
export const calculateGrainsTopLevel = () => {
  const validatedInput: ValidationResult<GrainsInputTransformed, GrainsInput> =
    validateCalculatorInput(GrainsInputSchema, grainsInputData);

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
