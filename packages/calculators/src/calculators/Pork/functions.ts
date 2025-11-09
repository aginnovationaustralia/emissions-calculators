import { PorkComplete } from '@/types/Pork/pork.input';
import { calculateScope3FuelWithLPGAverage } from '../common-legacy/fuel';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPorkCalculator } from './constants';

export function getN2OEF(
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  return constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP;
}

export function calculateScope3Bedding(
  pork: PorkComplete,
  context: ExecutionContext<ConstantsForPorkCalculator>,
) {
  const { constants } = context;

  return pork.beddingHayBarleyStraw * constants.PORK.EF_BEDDING;
}

export function getScope3FuelFunction(
  context: ExecutionContext<ConstantsForPorkCalculator>,
  diesel: number,
  petrol: number,
  lpg: number,
) {
  return calculateScope3FuelWithLPGAverage(diesel, petrol, lpg, context);
}

export function getNFertiliserOtherDryland(
  totalOtherDryland: number,
  fracWetMultiplier: number,
  fracLeach: number,
) {
  return totalOtherDryland * fracWetMultiplier * fracLeach;
}
