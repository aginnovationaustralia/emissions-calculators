import { SheepClassesInputSchema } from '@/calculators/Sheep/types/sheep-classes.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { hasExcludedFromNaturalWaterInputSchema } from '@/calculators/types/has-excluded-from-natural-water.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { States } from '@/constants/enums';
import { enumInput } from '@/tools/inputs';
import { ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4 } from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const SheepManureAndEntericSharedFieldsSchema = object({
  classes: SheepClassesInputSchema,
  state: enumInput(States, {
    name: 'Flock state',
    description: 'The state the flock is located in',
    modules: [ENTERIC_SHEEP_3_4, MANURE_SHEEP_4_4],
  }),
  ...hasExcludedFromNaturalWaterInputSchema(MANURE_SHEEP_4_4).shape,
  ...hasIsInLeachingZoneInputSchema(MANURE_SHEEP_4_4).shape,
  ...hasClimateZoneInputSchema(MANURE_SHEEP_4_4).shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_SHEEP_4_4).shape,
  ...hasGrazingProductionSystemInputSchema(MANURE_SHEEP_4_4).shape,
});

/**
 * The subset of `SheepFlockInputTransformed` actually read by the sheep enteric methane
 * (3.4) and sheep manure management (4.4) calculations for a flock -- i.e. the functions
 * in this `shared/sheep` module plus their callers in `3-enteric-methane/3.4-sheep-enteric`
 * and `4-manure-management/4.4-sheep-manure`. This is exactly
 * `SheepManureAndEntericSharedFieldsSchema` -- the same shared schema
 * `SheepFlockCoreInputSchema` extends -- so it stays in lock-step with the full sheep
 * flock schema. Used to give those functions -- and the AllModules calculator, which
 * only needs to supply these fields for its `sheep` input -- a narrower parameter type
 * than the full `SheepFlockInputTransformed`.
 */
export const SheepManureAndEntericHerdInputSchema =
  SheepManureAndEntericSharedFieldsSchema;

export type SheepManureAndEntericHerdInput = z.input<
  typeof SheepManureAndEntericHerdInputSchema
>;
export type SheepManureAndEntericHerdInputTransformed = z.output<
  typeof SheepManureAndEntericHerdInputSchema
>;
