import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { FeedlotLotLivestockInputSchema } from '@/modules/scope1/shared/feedlot/input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasBeefPurchasedLivestockInputSchema } from '@/modules/scope3/15.1-purchased-livestock/input';
import { HasPurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { PurchasedMineralSupplementsInputSchema } from '@/modules/scope3/15.3-purchased-mineral-supplements/purchased-mineral-supplements.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass } from '@/tools/units';
import z from 'zod';

export const FeedlotLotInputSchema = LivestockActivityInputSchema.safeExtend({
  ...FeedlotLotLivestockInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasBeefPurchasedLivestockInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
  ...PurchasedMineralSupplementsInputSchema.shape,
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

export type FeedlotLotInput = z.input<typeof FeedlotLotInputSchema>;
export type FeedlotLotInputTransformed = z.output<typeof FeedlotLotInputSchema>;
