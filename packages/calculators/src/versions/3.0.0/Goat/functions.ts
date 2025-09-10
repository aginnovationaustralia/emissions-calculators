import { divideOrZero } from '@/utils/utils';
import { ExecutionContext } from '../executionContext';

export function getMultiplier(context: ExecutionContext) {
  const { constants } = context;

  return (
    constants.FRAC_GASM *
    constants.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.GWP_FACTORSC15
  );
}

export function getLeachingOtherDryland(
  otherFertiliserDryland: number,
  fracWetMultiplier: number,
  fracLEACH: number,
) {
  return otherFertiliserDryland * fracWetMultiplier * fracLEACH;
}

export function getIntensities(
  grossEmissions: number,
  carbonSequestration: number,
  cleanWoolTonnes: number,
  greasyWoolTonnes: number,
  totalSaleWeightKg: number,
) {
  const proteinFactor = 0.18;

  // (assumptionsD3)
  const meatProtein = totalSaleWeightKg * proteinFactor;

  const meatAllocationFactor = divideOrZero(
    meatProtein,
    meatProtein + cleanWoolTonnes * 1000,
  );

  const woolAllocationFactor = divideOrZero(
    cleanWoolTonnes * 1000,
    meatProtein + cleanWoolTonnes * 1000,
  );

  const goatMeatBreedingExcludingSequestration = divideOrZero(
    grossEmissions * 1000 * meatAllocationFactor,
    totalSaleWeightKg,
  );

  const goatMeatBreedingIncludingSequestration = divideOrZero(
    (grossEmissions - carbonSequestration) * 1000 * meatAllocationFactor,
    totalSaleWeightKg,
  );

  const woolExcludingSequestration = divideOrZero(
    grossEmissions * 1000 * woolAllocationFactor,
    greasyWoolTonnes,
  );

  const woolIncludingSequestration = divideOrZero(
    (grossEmissions - carbonSequestration) * 1000 * woolAllocationFactor,
    greasyWoolTonnes,
  );

  const intensities = {
    goatMeatBreedingExcludingSequestration,
    goatMeatBreedingIncludingSequestration,
    woolExcludingSequestration,
    woolIncludingSequestration,
    amountMeatProduced: totalSaleWeightKg,
    amountWoolProduced: greasyWoolTonnes,
  };

  return intensities;
}
