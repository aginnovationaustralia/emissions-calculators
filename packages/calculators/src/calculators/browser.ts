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
} from './browser-calculators';

export * from './browser-calculators';
export { CalculatorOptions } from './execution/types';
export { CalculatorNames, isValidCalculatorName } from './strings';
export { validateCalculatorInput } from './validate';

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
