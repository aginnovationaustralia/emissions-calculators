import { ActivityInputSchema } from '@/calculators/types/activity.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import { HasWastewaterTreatmentInputSchema } from '@/modules/scope1/11-wastewater/wastewater-treatment.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { RefrigerantsInputSchema } from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasAquaculturePurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES, PURCH_FUEL_15_10 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import z from 'zod';

export const WildCatchFisheryInputSchema = ActivityInputSchema.safeExtend({
  ...HasAquaculturePurchasedFeedInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...RefrigerantsInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasWastewaterTreatmentInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...hasStateInputSchema([PURCH_FUEL_15_10]).shape,
  amountHarvested: numberInput((value) => mass('Fish', tonnesToKg(value)), {
    name: 'amountHarvested',
    description: 'Quantity of fish or crustaceans harvested, in tonnes.',
    modules: [INTENSITIES],
  }),
});
export type WildCatchFisheryInput = z.input<typeof WildCatchFisheryInputSchema>;
export type WildCatchFisheryInputTransformed = z.output<
  typeof WildCatchFisheryInputSchema
>;
