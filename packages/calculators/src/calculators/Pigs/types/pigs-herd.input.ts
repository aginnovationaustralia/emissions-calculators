import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { PigsHerdLivestockInputSchema } from '@/modules/scope1/shared/pigs/input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasPigPurchasedLivestockInputSchema } from '@/modules/scope3/15.1-purchased-livestock/input';
import { HasPurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass } from '@/tools/units';
import z from 'zod';

export const PigsHerdInputSchema = LivestockActivityInputSchema.safeExtend({
  ...PigsHerdLivestockInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasPigPurchasedLivestockInputSchema.shape,
  ...HasPurchasedFeedInputSchema.shape,
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

export type PigsHerdInput = z.input<typeof PigsHerdInputSchema>;
export type PigsHerdInputTransformed = z.output<typeof PigsHerdInputSchema>;
