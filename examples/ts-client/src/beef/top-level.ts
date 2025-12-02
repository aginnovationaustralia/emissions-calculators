import {
  BeefInputSchema,
  calculateBeef,
  validateCalculatorInput,
} from '@aginnovationaustralia/emissions-calculators';
import { beefInputData } from './input';

/**
 * Calculate beef emissions using top-level exports, which might be a little easier to discover and start working with.
 * These import paths will be larger due to the inclusion of all calculators and types.
 * @returns Beef emissions
 */
export const calculateBeefTopLevel = () => {
  const validatedInput = validateCalculatorInput(
    BeefInputSchema,
    beefInputData,
  );

  if (!validatedInput.valid) {
    throw validatedInput.error;
  }

  const result = calculateBeef(validatedInput.result, { disableMetrics: true });
  return result;
};
