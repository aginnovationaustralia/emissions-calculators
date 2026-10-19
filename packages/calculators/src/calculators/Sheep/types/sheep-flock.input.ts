import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { HasFertiliserInputSchema } from '@/modules/scope1/5-fertiliser';
import { HasLimeInputSchema } from '@/modules/scope1/5-fertiliser/lime.input';
import { HasPastureResidueInputSchema } from '@/modules/scope1/6-residue-mgmt';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { SheepManureAndEntericSharedFieldsSchema } from '@/modules/scope1/shared/sheep/input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasSheepPurchasedLivestockInputSchema } from '@/modules/scope3/15.1-purchased-livestock/input';
import { HasPurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { PurchasedMineralSupplementsInputSchema } from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import { AgrichemicalsInputSchema } from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass } from '@/tools/units';
import { z } from 'zod';

// Core fields without fertiliser, exported so narrower field-subset schemas (e.g.
// shared/sheep/input.ts, used to trim the AllModules input down to what the enteric
// methane/manure management calculations actually need) can pick individual fields off
// `.shape` rather than redefining them.
export const SheepFlockCoreInputSchema =
  LivestockActivityInputSchema.safeExtend({
    ...SheepManureAndEntericSharedFieldsSchema.shape,
    ...HasLimeInputSchema.shape,
    ...HasPastureResidueInputSchema.shape,
    ...hasFuelInputSchema('fuel').shape,
    ...HasSolidWasteInputSchema.shape,
    ...HasSheepPurchasedLivestockInputSchema.shape,
    ...HasPurchasedFeedInputSchema.shape,
    ...PurchasedMineralSupplementsInputSchema.shape,
    ...AgrichemicalsInputSchema.shape,
    ...ServicesInputSchema.shape,
    ...OtherPurchasedGoodsAndServicesSchema.shape,
    liveweightSoldKg: numberInput(
      (val) => mass('Liveweight', val),
      {
        name: 'liveweightSoldKg',
        description:
          'The liveweight of the animals sold during the reporting period',
        modules: [INTENSITIES],
      },
      (s) => s.min(0),
    ),
  });

export const SheepFlockInputSchema = SheepFlockCoreInputSchema.safeExtend({
  ...HasFertiliserInputSchema.shape,
});

export type SheepFlockInput = z.input<typeof SheepFlockInputSchema>;
export type SheepFlockInputTransformed = z.output<typeof SheepFlockInputSchema>;
