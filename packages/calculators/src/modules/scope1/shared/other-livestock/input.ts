import { OtherLivestockClassInputSchema } from '@/calculators/OtherLivestock/types/class.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { hasExcludedFromNaturalWaterInputSchema } from '@/calculators/types/has-excluded-from-natural-water.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import { hasIsInLeachingZoneInputSchema } from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import {
  MANURE_OTHER_4_7,
  PURCH_FUEL_15_10,
  RESIDUE_LEACH_6_3,
  SERVICES_15_7,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const OtherLivestockManureAndEntericSharedFieldsSchema = object({
  livestock: z.array(OtherLivestockClassInputSchema),
  ...hasExcludedFromNaturalWaterInputSchema(MANURE_OTHER_4_7).shape,
  ...hasIsInLeachingZoneInputSchema(MANURE_OTHER_4_7).shape,
  ...hasStateInputSchema([
    MANURE_OTHER_4_7,
    RESIDUE_LEACH_6_3,
    SERVICES_15_7,
    PURCH_FUEL_15_10,
  ]).shape,
  ...hasClimateZoneInputSchema(MANURE_OTHER_4_7).shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_OTHER_4_7).shape,
  ...hasGrazingProductionSystemInputSchema(MANURE_OTHER_4_7).shape,
});

/**
 * The subset of `OtherLivestockHerdInputTransformed` actually read by the 'other
 * livestock' enteric methane (3.6) and manure management (4.7) calculations for a herd
 * -- i.e. `calculate36OtherLivestockEntericMethaneForHerd` in
 * `3-enteric-methane/3.6-other-livestock` and `calculate47OtherLivestockManureManagement`
 * (plus the helper functions it calls) in
 * `4-manure-management/4.7-other-livestock-manure`. This is exactly
 * `OtherLivestockManureAndEntericSharedFieldsSchema` -- the same shared schema
 * `OtherLivestockHerdCoreInputSchema` extends -- so it stays in lock-step with the full
 * 'other livestock' herd schema. Used to give those functions -- and the AllModules
 * calculator, which only needs to supply these fields for its `otherLivestock` input --
 * a narrower parameter type than the full `OtherLivestockHerdInputTransformed`.
 */
export const OtherLivestockManureAndEntericHerdInputSchema =
  OtherLivestockManureAndEntericSharedFieldsSchema;

export type OtherLivestockManureAndEntericHerdInput = z.input<
  typeof OtherLivestockManureAndEntericHerdInputSchema
>;
export type OtherLivestockManureAndEntericHerdInputTransformed = z.output<
  typeof OtherLivestockManureAndEntericHerdInputSchema
>;
