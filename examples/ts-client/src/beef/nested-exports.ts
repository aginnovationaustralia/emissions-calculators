import {
  BeefInputSchema,
  calculateBeef,
} from '@aginnovationaustralia/emissions-calculators/beef';
import { validateCalculatorInput } from '@aginnovationaustralia/emissions-calculators/validate';
import { beefInputData } from './input';

/**
 * Calculate beef emissions using nested export paths, which should allow for a much smaller bundle size via tree shaking.
 * Avoid top level exports to prevent a bundler pulling in the implementation and schemas for all calculators.
 *
 * @returns Beef emissions
 */
export const calculateBeefNestedExport = () => {
  const validatedInput = validateCalculatorInput(
    BeefInputSchema,
    beefInputData,
  );

  if (!validatedInput.valid) {
    console.error('Input was not valid', validatedInput.error.errors);
    throw validatedInput.error;
  }

  const result = calculateBeef(validatedInput.result, { disableMetrics: true });
  return result;
};
