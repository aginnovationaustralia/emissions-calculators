import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { HasFertiliserInputSchema } from '@/modules/scope1/5-fertiliser';
import { HasLimeInputSchema } from '@/modules/scope1/5-fertiliser/lime.input';
import { HasPastureResidueInputSchema } from '@/modules/scope1/6-residue-mgmt';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { OtherLivestockManureAndEntericSharedFieldsSchema } from '@/modules/scope1/shared/other-livestock/input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasOtherPurchasedLivestockInputSchema } from '@/modules/scope3/15.1-purchased-livestock/input';
import { HasPurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { PurchasedMineralSupplementsInputSchema } from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import { AgrichemicalsInputSchema } from '@/modules/scope3/15.5-agrichemicals/agrichemicals.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass } from '@/tools/units';
import { z } from 'zod';

export const OtherLivestockHerdCoreInputSchema =
  LivestockActivityInputSchema.safeExtend({
    ...OtherLivestockManureAndEntericSharedFieldsSchema.shape,
    ...HasOtherPurchasedLivestockInputSchema.shape,
    ...OtherPurchasedGoodsAndServicesSchema.shape,
    ...ServicesInputSchema.shape,
    ...AgrichemicalsInputSchema.shape,
    ...PurchasedMineralSupplementsInputSchema.shape,
    ...HasPurchasedFeedInputSchema.shape,
    ...HasSolidWasteInputSchema.shape,
    ...hasFuelInputSchema('fuel').shape,
    ...HasPastureResidueInputSchema.shape,
    ...HasLimeInputSchema.shape,
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

export const OtherLivestockHerdInputSchema =
  OtherLivestockHerdCoreInputSchema.safeExtend({
    ...HasFertiliserInputSchema.shape,
  });

export type OtherLivestockHerdInput = z.input<
  typeof OtherLivestockHerdInputSchema
>;
export type OtherLivestockHerdInputTransformed = z.output<
  typeof OtherLivestockHerdInputSchema
>;
