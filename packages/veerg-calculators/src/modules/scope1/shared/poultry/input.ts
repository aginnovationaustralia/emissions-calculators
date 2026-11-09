import {
  PoultryClassesLivestockInputSchema,
  poultryClassesSharedInputSchema,
} from '@/calculators/Poultry/types/poultry-classes.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { HasFractionAppliedToSoilsInputSchema } from '@/calculators/types/has-fraction-applied-to-soils.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import {
  LivestockLocation,
  MANURE_POULTRY_4_6,
  PURCH_FUEL_15_10,
  SERVICES_15_7,
  livestockModuleOrFertiliser,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * Keys of a poultry flock read both by poultry manure management (4.6) and, when the
 * flock's manure is applied as organic fertiliser, by the chapter 5 nitrogen
 * calculation (`calculateMassOfNitrogenAppliedToSoilsForPoultry`). `classes` is left out
 * because the livestock scenario reads more of each class, so each scenario adds its
 * own.
 */
const poultryFlockSharedShape = (location: LivestockLocation) => ({
  ...hasIsInLeachingZoneInputSchema(
    livestockModuleOrFertiliser(location, MANURE_POULTRY_4_6),
  ).shape,
});

/**
 * A poultry flock as read by poultry manure management (4.6).
 */
export const PoultryFlockLivestockInputSchema = object({
  classes: PoultryClassesLivestockInputSchema,
  ...poultryFlockSharedShape('livestock'),
  ...hasStateInputSchema([MANURE_POULTRY_4_6, SERVICES_15_7, PURCH_FUEL_15_10])
    .shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_POULTRY_4_6).shape,
  ...hasClimateZoneInputSchema(MANURE_POULTRY_4_6).shape,
  ...hasGrazingProductionSystemInputSchema(MANURE_POULTRY_4_6).shape,
});

export type PoultryFlockLivestockInput = z.input<
  typeof PoultryFlockLivestockInputSchema
>;
export type PoultryFlockLivestockInputTransformed = z.output<
  typeof PoultryFlockLivestockInputSchema
>;

/**
 * A poultry flock whose manure is the source of an organic fertiliser application, as
 * read by the chapter 5 nitrogen calculation.
 */
export const PoultryFlockFertiliserInputSchema = object({
  classes: poultryClassesSharedInputSchema('fertiliser'),
  ...poultryFlockSharedShape('fertiliser'),
  ...HasFractionAppliedToSoilsInputSchema.shape,
});

export type PoultryFlockFertiliserInput = z.input<
  typeof PoultryFlockFertiliserInputSchema
>;
export type PoultryFlockFertiliserInputTransformed = z.output<
  typeof PoultryFlockFertiliserInputSchema
>;
