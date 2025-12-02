import { generateCalculateEmissions } from '@/calculate';
import {
  calculateAquaculture,
  calculateBeef,
  calculateBuffalo,
  calculateCotton,
  calculateDairy,
  calculateDeer,
  calculateFeedlot,
  calculateGoat,
  calculateGrains,
  calculateHorticulture,
  calculatePork,
  calculatePoultry,
  calculateProcessing,
  calculateRice,
  calculateSheep,
  calculateSheepBeef,
  calculateSugar,
  calculateVineyard,
  calculateWildCatchFishery,
  calculateWildSeaFisheries,
} from './calculators';

export * from './calculators';
export { CalculatorOptions } from './execution/types';
export { CalculatorNames, isValidCalculatorName } from './strings';
export { validateCalculatorInput } from './validate';

/**
 * Calculates the emissions for a given calculator name and input. It will perform validation of the input
 * before passing it to the calculator function, based on the calculator name you provide.
 * The type of the output is determined by the calculator name you provide.
 *
 * const result = calculateEmissions('beef', userInputData, { disableMetrics: true });
 * if (result.succeeded) {
 *   const emissions: BeefInput = result.emissions;
 *   console.log('Emissions calculated correctly', emissions);
 * } else if (result.valid) {
 *   console.error('Emissions calculation failed', result.error);
 * } else {
 *   const inputValidationError: InputValidationError = result.error;
 *   console.error('Input was not valid', inputValidationError.errors);
 * }
 *
 * return result;
 *
 * @param calculatorName - The name of the calculator to use
 * @param input - The input to the calculator
 * @param options - The options to the calculator
 * @returns CalculateEmissionsResult<O>
 * @function calculateEmissions
 */
export const calculateEmissions = generateCalculateEmissions({
  calculateBeef,
  calculateAquaculture,
  calculateBuffalo,
  calculateCotton,
  calculateDairy,
  calculateDeer,
  calculateFeedlot,
  calculateGoat,
  calculateGrains,
  calculateHorticulture,
  calculatePork,
  calculatePoultry,
  calculateProcessing,
  calculateRice,
  calculateSheep,
  calculateSheepBeef,
  calculateSugar,
  calculateVineyard,
  calculateWildCatchFishery,
  calculateWildSeaFisheries,
});

export type { CalculateEmissionsResult } from '../calculate';

// Node only exports
export { CalculationEnvironment } from './execution/node/environment';
