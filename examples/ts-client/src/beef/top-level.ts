import {
  BeefInput,
  BeefInputSchema,
  calculateBeef,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators';
import { ValidationResult } from '@aginnovationaustralia/emissions-calculators/validate';
import { beefInputData } from './input';

/**
 * Calculate beef emissions using top-level exports, which might be a little easier to discover and start working with.
 * These import paths will be larger due to the inclusion of all calculators and types.
 * @returns Beef emissions
 */
export const calculateBeefTopLevel = () => {
  const validatedInput: ValidationResult<BeefInput> = validateCalculatorInput(
    BeefInputSchema,
    beefInputData,
  );

  if (!validatedInput.valid) {
    const formattedString = validatedInput.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(', ');
    console.error('Input was not valid', formattedString);
    throw new Error('Input was not valid: ' + formattedString);
  }

  const result = calculateBeef(validatedInput.result, { disableMetrics: true });
  return result;
};
