import {
  calculateGrainsParsed,
  validateCalculatorInput,
} from '@aginnovationaustralia/veerg-calculators';
import {
  GrainsInput,
  GrainsInputSchema,
  GrainsInputTransformed,
} from '@aginnovationaustralia/veerg-calculators/grains';
import { ValidationResult } from '@aginnovationaustralia/veerg-calculators/validate';
import { grainsInputDataMethod1 } from './input';

/**
 * Calculate beef emissions using top-level exports, which might be a little easier to discover and start working with.
 * These import paths will be larger due to the inclusion of all calculators and types.
 * @returns Beef emissions
 */
export const calculateGrainsTopLevel = () => {
  const validatedInput: ValidationResult<GrainsInputTransformed, GrainsInput> =
    validateCalculatorInput(GrainsInputSchema, grainsInputDataMethod1);

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  const result = calculateGrainsParsed(validatedInput.result, {
    disableMetrics: true,
  });
  return result;
};
