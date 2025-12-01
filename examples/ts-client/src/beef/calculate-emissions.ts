import {
  BeefOutput,
  calculateEmissions,
  CalculateEmissionsResult,
  isValidCalculatorName,
} from '@aginnovationaustralia/emissions-calculators';
import { beefInputData } from './input';

/**
 * The simplest way to calculate beef emissions is to use the top-level `calculateEmissions` function.
 * This also shows how to use the `isValidCalculatorName` type guard function to check if a calculator name is valid.
 *
 * @returns A CalculateEmissionsResult containing the beef emissions, or errors if they occurred
 */
export const calculateBeefSimple = () => {
  const calculatorName: string = 'beef';
  const nameCheck = isValidCalculatorName(calculatorName);
  if (!nameCheck) {
    throw new Error(`Invalid calculator name: ${calculatorName}`);
  }

  const result: CalculateEmissionsResult<BeefOutput> = calculateEmissions(
    calculatorName,
    beefInputData,
  );
  if (result.succeeded) {
    console.log('Emissions calculated correctly', result.emissions);
  } else if (result.valid) {
    console.error('Emissions calculation failed', result.error);
  } else {
    console.error('Input was not valid', result.error.errors);
  }

  return result;
};
