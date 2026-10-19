import {
  ActivityInput,
  ActivityInputTransformed,
} from '@/calculators/types/activity.input';
import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import {
  FertiliserInputSchema,
  HasFertiliserInput,
  HasFertiliserInputTransformed,
} from '@/modules/scope1/5-fertiliser/fertiliser.input';
import {
  HasLimeInput,
  HasLimeInputSchema,
  HasLimeInputTransformed,
} from '@/modules/scope1/5-fertiliser/lime.input';
import {
  HasPastureResidueInput,
  HasPastureResidueInputSchema,
  HasPastureResidueInputTransformed,
} from '@/modules/scope1/6-residue-mgmt';
import {
  HasFuelInput,
  hasFuelInputSchema,
  HasFuelInputTransformed,
} from '@/modules/scope1/8-fuel-use';
import {
  RefrigerantsInput,
  RefrigerantsInputSchema,
  RefrigerantsInputTransformed,
} from '@/modules/scope1/9-refrigerant-use/refrigerants.input';
import {
  DairyHerdLivestockFieldsSchema,
  DairyHerdLivestockInput,
  DairyHerdLivestockInputTransformed,
  withDairyTimeInLocations,
} from '@/modules/scope1/shared/dairy/input';
import {
  HasSolidWasteInput,
  HasSolidWasteInputSchema,
  HasSolidWasteInputTransformed,
} from '@/modules/scope1/shared/solid-waste/input';
import {
  HasDairyPurchasedLivestockInput,
  HasDairyPurchasedLivestockInputSchema,
  HasDairyPurchasedLivestockInputTransformed,
} from '@/modules/scope3/15.1-purchased-livestock/input';
import {
  HasPurchasedFeedInput,
  HasPurchasedFeedInputSchema,
  HasPurchasedFeedInputTransformed,
} from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import {
  PurchasedMineralSupplementsInput,
  PurchasedMineralSupplementsInputSchema,
  PurchasedMineralSupplementsInputTransformed,
} from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import {
  AgrichemicalsInput,
  AgrichemicalsInputSchema,
  AgrichemicalsInputTransformed,
} from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import {
  ServicesInput,
  ServicesInputSchema,
  ServicesInputTransformed,
} from '@/modules/scope3/15.7-services/services.input';
import {
  OtherPurchasedGoodsAndServicesInput,
  OtherPurchasedGoodsAndServicesInputTransformed,
  OtherPurchasedGoodsAndServicesSchema,
} from '@/modules/scope3/15.9-other-purchases';
import { z } from 'zod';
import {
  DairySaleInput,
  DairySaleInputSchema,
  DairySaleInputTransformed,
} from './sale.input';

const DairyHerdFieldsSchema = LivestockActivityInputSchema.extend({
  ...DairyHerdLivestockFieldsSchema.shape,
  fertiliser: FertiliserInputSchema,
  ...HasLimeInputSchema.shape,
  ...HasPastureResidueInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...RefrigerantsInputSchema.shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasDairyPurchasedLivestockInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
  ...PurchasedMineralSupplementsInputSchema.shape,
  ...AgrichemicalsInputSchema.shape,
  ...ServicesInputSchema.shape,
  ...OtherPurchasedGoodsAndServicesSchema.shape,
  livestockSales: z.array(DairySaleInputSchema),
});

export type DairyHerdInput = ActivityInput &
  DairyHerdLivestockInput &
  HasLimeInput &
  HasPastureResidueInput &
  HasFuelInput &
  RefrigerantsInput &
  HasSolidWasteInput &
  HasDairyPurchasedLivestockInput &
  HasPurchasedFeedInput &
  PurchasedMineralSupplementsInput &
  AgrichemicalsInput &
  ServicesInput &
  OtherPurchasedGoodsAndServicesInput &
  HasFertiliserInput & { livestockSales: DairySaleInput[] };
export type DairyHerdInputTransformed = ActivityInputTransformed &
  DairyHerdLivestockInputTransformed &
  HasLimeInputTransformed &
  HasPastureResidueInputTransformed &
  HasFuelInputTransformed &
  RefrigerantsInputTransformed &
  HasSolidWasteInputTransformed &
  HasDairyPurchasedLivestockInputTransformed &
  HasPurchasedFeedInputTransformed &
  PurchasedMineralSupplementsInputTransformed &
  AgrichemicalsInputTransformed &
  ServicesInputTransformed &
  OtherPurchasedGoodsAndServicesInputTransformed &
  HasFertiliserInputTransformed & {
    livestockSales: DairySaleInputTransformed[];
  };

// Explicit ZodType: combining the time-location xor with fertiliser hits TS7056
// on declaration emit (same pattern as BeefHerd / GrainsCrop).
export const DairyHerdInputSchema: z.ZodType<
  DairyHerdInputTransformed,
  DairyHerdInput
> = withDairyTimeInLocations(DairyHerdFieldsSchema, 'livestock');
