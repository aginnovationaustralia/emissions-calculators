import { ActivityInputSchema } from '@/calculators/types/activity.input';
import { hasClimateZoneInputSchema } from '@/calculators/types/has-climate-zone.input';
import { States } from '@/constants/enums';
import { LULUCFParentInputSchema } from '@/modules/lulucf/input';
import {
  HasFertiliserInput,
  HasFertiliserInputSchema,
  HasFertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser/fertiliser.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { AgrichemicalsInputSchema } from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { enumInput } from '@/tools/inputs';
import {
  FERT_ORGANIC_5_2,
  PURCH_FUEL_15_10,
  SERVICES_15_7,
} from '@/tools/modules';
import { z } from 'zod';

/**
 * The shape of the fertiliser input can change depending on the specific calculation
 * method, so it isn't added here (see ForestryPlantationInputSchema below).
 */
export const ForestryPlantationBaseInputSchema = ActivityInputSchema.safeExtend(
  {
    ...AgrichemicalsInputSchema.shape,
    ...ServicesInputSchema.shape,
    ...HasSolidWasteInputSchema.shape,
    ...OtherPurchasedGoodsAndServicesSchema.shape,
    state: enumInput(States, {
      name: 'Activity state or territory',
      description: 'The state or territory the activity is based in',
      modules: [SERVICES_15_7, PURCH_FUEL_15_10],
    }),
    ...hasFuelInputSchema('fuel').shape,
    ...hasClimateZoneInputSchema(FERT_ORGANIC_5_2).shape,
    ...LULUCFParentInputSchema.shape,
  },
);

export type ForestryPlantationBaseInput = z.input<
  typeof ForestryPlantationBaseInputSchema
>;
export type ForestryPlantationBaseInputTransformed = z.output<
  typeof ForestryPlantationBaseInputSchema
>;

export type ForestryPlantationInput = ForestryPlantationBaseInput &
  HasFertiliserInput;
export type ForestryPlantationInputTransformed =
  ForestryPlantationBaseInputTransformed & HasFertiliserInputTransformed;

export const ForestryPlantationInputSchema: z.ZodType<
  ForestryPlantationInputTransformed,
  ForestryPlantationInput
> = ForestryPlantationBaseInputSchema.safeExtend({
  ...HasFertiliserInputSchema.shape,
}).meta({
  title: 'Forestry plantation',
});
