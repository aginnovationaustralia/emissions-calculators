import { divideBySafeFromZero } from '../common/tools';
import { ExecutionContext } from '../executionContext';
import { ConstantsForGoatCalculator } from './constants';

export function getMultiplier(
  context: ExecutionContext<ConstantsForGoatCalculator>,
) {
  const { constants } = context;

  return (
    constants.LIVESTOCK.FRAC_GASM *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE *
    constants.COMMON.GWP_FACTORSC15
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

  const meatAllocationFactor = divideBySafeFromZero(
    meatProtein,
    meatProtein + cleanWoolTonnes * 1000,
  );

  const woolAllocationFactor = divideBySafeFromZero(
    cleanWoolTonnes * 1000,
    meatProtein + cleanWoolTonnes * 1000,
  );

  const goatMeatBreedingExcludingSequestration = divideBySafeFromZero(
    grossEmissions * 1000 * meatAllocationFactor,
    totalSaleWeightKg,
  );

  const goatMeatBreedingIncludingSequestration = divideBySafeFromZero(
    (grossEmissions - carbonSequestration) * 1000 * meatAllocationFactor,
    totalSaleWeightKg,
  );

  const woolExcludingSequestration = divideBySafeFromZero(
    grossEmissions * 1000 * woolAllocationFactor,
    greasyWoolTonnes,
  );

  const woolIncludingSequestration = divideBySafeFromZero(
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
