import {
  PigsHerdClassesLivestockInputSchema,
  pigsHerdClassesSharedInputSchema,
} from '@/calculators/Pigs/types/pigs-classes.input';
import { HasFractionAppliedToSoilsInputSchema } from '@/calculators/types/has-fraction-applied-to-soils.input';
import { hasGrazingProductionSystemInputSchema } from '@/calculators/types/has-grazing-production-system.input';
import {
  hasIsInLeachingZoneInputSchema,
  HasIsInLeachingZoneInputSchemaForFertiliser,
} from '@/calculators/types/has-is-in-leaching.input';
import { hasMethod2MeanAnnualTemperatureInputSchema } from '@/calculators/types/has-method2-mean-annual-temperature.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import {
  MANURE_PIGS_4_5,
  PURCH_FUEL_15_10,
  SERVICES_15_7,
} from '@/tools/modules';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * A pig herd as read by pigs enteric methane (3.5) and manure management (4.5).
 */
export const PigsHerdLivestockInputSchema = object({
  classes: PigsHerdClassesLivestockInputSchema,
  ...hasIsInLeachingZoneInputSchema(MANURE_PIGS_4_5).shape,
  ...hasStateInputSchema([MANURE_PIGS_4_5, SERVICES_15_7, PURCH_FUEL_15_10])
    .shape,
  ...hasMethod2MeanAnnualTemperatureInputSchema(MANURE_PIGS_4_5).shape,
  ...hasGrazingProductionSystemInputSchema(MANURE_PIGS_4_5).shape,
});

export type PigsHerdLivestockInput = z.input<
  typeof PigsHerdLivestockInputSchema
>;
export type PigsHerdLivestockInputTransformed = z.output<
  typeof PigsHerdLivestockInputSchema
>;

/**
 * A pig herd whose manure is the source of an organic fertiliser application, as read
 * by the chapter 5 nitrogen calculation.
 */
export const PigsHerdFertiliserInputSchema = object({
  classes: pigsHerdClassesSharedInputSchema('fertiliser'),
  ...HasIsInLeachingZoneInputSchemaForFertiliser.shape,
  ...HasFractionAppliedToSoilsInputSchema.shape,
});

export type PigsHerdFertiliserInput = z.input<
  typeof PigsHerdFertiliserInputSchema
>;
export type PigsHerdFertiliserInputTransformed = z.output<
  typeof PigsHerdFertiliserInputSchema
>;
