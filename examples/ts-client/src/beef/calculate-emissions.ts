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
  if (result.status === 'OK') {
    console.log('Emissions calculated correctly', result.emissions);
  } else if (result.status === 'INVALID_INPUT') {
    console.error('Input was not valid', result.issues.join(', '));
  } else {
    console.error('Error calculating emissions', result.error.message);
  }

  return result;
};
