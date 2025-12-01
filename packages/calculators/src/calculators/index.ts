import { generateCalculate } from '@/calculate';
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
export { CalculationEnvironment } from './execution/node/environment';
export { CalculatorOptions } from './execution/types';
export { CalculatorNames, isValidCalculatorName } from './strings';
export { validateCalculatorInput } from './validate';

export const calculate = generateCalculate({
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
