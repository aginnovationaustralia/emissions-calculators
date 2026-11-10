import { BeefClassesInputSchema } from '@/calculators/Beef/types/beef-classes.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { hasExcludedFromNaturalWaterInputSchema } from '@/calculators/types/has-excluded-from-natural-water.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { BeefBreeds, StateOrRegions } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { ENTERIC_BEEF_3_2, MANURE_BEEF_4_2 } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const BeefManureAndEntericSharedFieldsSchema = object({
  region: enumInput(StateOrRegions, {
    name: 'Herd region',
    description: 'The state or region the herd is located in',
    modules: [ENTERIC_BEEF_3_2, MANURE_BEEF_4_2],
  }),
  classes: BeefClassesInputSchema,
  breed: enumInput(BeefBreeds, {
    name: 'Herd breed',
    description: 'The basic breed type of the herd',
    modules: [MANURE_BEEF_4_2],
  }),
  ...hasGrazingProductionSystemInputSchema(MANURE_BEEF_4_2).shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_BEEF_4_2).shape,
  ...hasClimateZoneInputSchema(MANURE_BEEF_4_2).shape,
  ...hasIsInLeachingZoneInputSchema(MANURE_BEEF_4_2).shape,
  ...hasExcludedFromNaturalWaterInputSchema(MANURE_BEEF_4_2).shape,
});

/**
 * The subset of `BeefHerdInputTransformed` actually read by the pasture enteric methane
 * (3.2) and pasture manure management (4.2) calculations for a herd -- i.e. the functions
 * in this `shared/beef` module plus their callers in `3-enteric-methane/3.2-beef-pasture`
 * and `4-manure-management/4.2-beef-pasture`. This is exactly
 * `BeefManureAndEntericSharedFieldsSchema` -- the same shared schema
 * `BeefHerdCoreInputSchema` extends -- so it stays in lock-step with the full beef herd
 * schema. Used to give those functions -- and the AllModules calculator, which only needs
 * to supply these fields for its `beef` input -- a narrower parameter type than the full
 * `BeefHerdInputTransformed`.
 */
export const BeefManureAndEntericHerdInputSchema =
  BeefManureAndEntericSharedFieldsSchema;

export type BeefManureAndEntericHerdInput = z.input<
  typeof BeefManureAndEntericHerdInputSchema
>;
export type BeefManureAndEntericHerdInputTransformed = z.output<
  typeof BeefManureAndEntericHerdInputSchema
>;
