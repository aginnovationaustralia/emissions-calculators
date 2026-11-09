import { HasLimeInputSchema } from '@/modules/scope1/5-fertiliser/lime.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { RefrigerantsInputSchema } from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { AgrichemicalsInputSchema } from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import {
  PURCH_FUEL_15_10,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
  SERVICES_15_7,
} from '@/tools/modules';
import z from 'zod';
import { ActivityInputSchema } from './activity.input';
import { HasClimateZoneInputSchemaForCrops } from './has-climate-zone.input';
import { HasIsInLeachingZoneInputSchemaForFertiliser } from './has-is-in-leaching.input';
import { hasStateInputSchema } from './has-state.input';

/**
 * The shape of the fertiliser input can change depending on the specific crop, so it
 * isn't added here.
 */
export const BaseCroppingActivityInputSchema = ActivityInputSchema.extend({
  ...AgrichemicalsInputSchema.shape,
  ...RefrigerantsInputSchema.shape,
  ...ServicesInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...hasStateInputSchema([
    RESIDUE_CROPS_6_1,
    RESIDUE_LEACH_6_3,
    SERVICES_15_7,
    PURCH_FUEL_15_10,
  ]).shape,
  ...hasFuelInputSchema('fuel').shape,
  ...HasLimeInputSchema.shape,
  ...HasClimateZoneInputSchemaForCrops.shape,
  ...HasIsInLeachingZoneInputSchemaForFertiliser.shape,
});

export type BaseCroppingActivityInput = z.input<
  typeof BaseCroppingActivityInputSchema
>;
export type BaseCroppingActivityInputTransformed = z.output<
  typeof BaseCroppingActivityInputSchema
>;
