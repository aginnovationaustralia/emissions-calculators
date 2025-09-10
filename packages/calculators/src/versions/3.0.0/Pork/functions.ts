import { calculateScope3FuelWithLPGAverage } from '../common-legacy/fuel';
import { ExecutionContext } from '../executionContext';
import { PorkComplete } from '../types/Pork/pork.input';

export function getN2OEF(context: ExecutionContext) {
  const { constants } = context;

  return constants.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP;
}

export function calculateScope3Bedding(
  pork: PorkComplete,
  context: ExecutionContext,
) {
  const { constants } = context;

  return pork.beddingHayBarleyStraw * constants.PORK_EF_BEDDING;
}

export function getScope3FuelFunction(
  context: ExecutionContext,
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
