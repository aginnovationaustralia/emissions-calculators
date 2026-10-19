import { ActivityInputSchema } from '@/calculators/types/activity.input';
import { hasStateInputSchema } from '@/calculators/types/has-state.input';
import { HasWastewaterTreatmentInputSchema } from '@/modules/scope1/11-wastewater/wastewater-treatment.input';
import { HasAquacultureSystemInputSchema } from '@/modules/scope1/13-aquatic';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { RefrigerantsInputSchema } from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import {
  HasAquaculturePurchasedFeedInputSchema,
  HasPurchasedFeedInputSchema,
} from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { PURCH_FUEL_15_10 } from '@/tools/modules';
import z from 'zod';

export const AquacultureFisheryInputSchema = ActivityInputSchema.safeExtend({
  ...HasAquaculturePurchasedFeedInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...RefrigerantsInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasWastewaterTreatmentInputSchema.shape,
  ...HasAquacultureSystemInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  ...hasStateInputSchema([PURCH_FUEL_15_10]).shape,
});

export type AquacultureFisheryInput = z.input<
  typeof AquacultureFisheryInputSchema
>;
export type AquacultureFisheryInputTransformed = z.output<
  typeof AquacultureFisheryInputSchema
>;
