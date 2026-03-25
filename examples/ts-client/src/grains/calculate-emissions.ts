import {
  calculateEmissions,
  CalculateEmissionsResult,
  GrainsOutput,
  isValidCalculatorName,
} from '@aginnovationaustralia/emissions-calculators';
import { grainsInputData } from './input';

/**
 * The simplest way to calculate beef emissions is to use the top-level `calculateEmissions` function.
 * This also shows how to use the `isValidCalculatorName` type guard function to check if a calculator name is valid.
 *
 * @returns A CalculateEmissionsResult containing the beef emissions, or errors if they occurred
 */
export const calculateGrainsSimple = () => {
  const calculatorName: string = 'grains';
  const nameCheck = isValidCalculatorName(calculatorName);
  if (!nameCheck) {
    throw new Error(`Invalid calculator name: ${calculatorName}`);
  }

  const result: CalculateEmissionsResult<GrainsOutput> = calculateEmissions(
    calculatorName,
    grainsInputData,
  );
  if (result.status === 'OK') {
    console.log('Emissions calculated correctly', result.emissions);
  } else if (result.status === 'INVALID_INPUT') {
    console.error('Input was not valid', result.message);
  } else {
    console.error('Error calculating emissions', result.error.message);
  }

  return result;
};
