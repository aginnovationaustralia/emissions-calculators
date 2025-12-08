import { calculateScope3FuelWithLPGAverage } from '../common-legacy/fuel';
import { ExecutionContext } from '../executionContext';
import { ConstantsForPoultryCalculator } from './constants';

// SHEET: Nitrous Oxide_MMS - Layers
// Indirect nitrous oxide emissions
// START Annual atmospheric deposition (E)
// E = MNatmos x EF x C
// MNatmos = Mass of poultry waste volatilised
// EF: Emissions factor for layer chickens 0.0041 16 Jul 2024
// Cg: 1.5714285714 (or 44/28) 16 Jul 2024
export function layersTotalIndirectNO2(
  massWasteVolatisedLayerAndMeat: number,
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  return (
    massWasteVolatisedLayerAndMeat *
    constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDCROP *
    constants.COMMON.GWP_FACTORSC15
  );
}
// END Annual atmospheric deposition (E)
//

export function getLayerProductionSystemEF(
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  return constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE;
}

export function getBroilerProductionSystemEF(
  context: ExecutionContext<ConstantsForPoultryCalculator>,
) {
  const { constants } = context;

  return constants.LIVESTOCK.AGRICULTURAL_SOILS.EF_NONIRRIGATEDPASTURE;
}

export function getLayersLeachingMassNLost(
  livestockNumbersLayersSpring: number,
  nitrogenExcretion: number,
  actualFractionWasteThroughDrylot: number,
  fracWET: number,
  fracLeachMS: number,
) {
  // (MNLEACH) = N x NE x MS x FracWET x FracLeach
  // N = Number of livestock
  // NE = mass of nitrogen excreted (Gg/head/season)
  // MS = fraction of waste handled through drylot and solid storage
  // FracWET = Fraction of N available for leaching and runoff
  // FracLeach_Ms = Fraction of N lost through leaching and runoff

  return (
    livestockNumbersLayersSpring *
    nitrogenExcretion *
    actualFractionWasteThroughDrylot *
    fracWET *
    fracLeachMS
  );
}

export function getBroilersTotalDungUrine(
  meatGrowerLeachDungUrine: number,
  meatLayersLeachDungUrine: number,
  meatOtherLeachDungUrine: number,
) {
  return (
    meatGrowerLeachDungUrine +
    meatLayersLeachDungUrine +
    meatOtherLeachDungUrine
  );
}

export function getScope3FuelFunction(
  context: ExecutionContext<ConstantsForPoultryCalculator>,
  diesel: number,
  petrol: number,
  lpg: number,
) {
  return calculateScope3FuelWithLPGAverage(diesel, petrol, lpg, context);
}

export function getBroilerTotalBirdNumbers(
  birdNumbers: number,
  percentLitterRecycled?: number,
  recyclesPerYear?: number,
) {
  const recycledPercent = percentLitterRecycled ?? 0;
  const numberOfRecycles = recyclesPerYear ?? 0;
  return birdNumbers * (1 - recycledPercent) ** numberOfRecycles;
}
