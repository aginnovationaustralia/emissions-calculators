import { LivestockActivityInputSchema } from '@/calculators/types/livestock-activity.input';
import { hasFuelInputSchema } from '@/modules/scope1/8-fuel-use';
import { PoultryFlockLivestockInputSchema } from '@/modules/scope1/shared/poultry/input';
import { HasSolidWasteInputSchema } from '@/modules/scope1/shared/solid-waste/input';
import { HasPoultryPurchasedLivestockInputSchema } from '@/modules/scope3/15.1-purchased-livestock/input';
import { HasPurchasedFeedInputSchema } from '@/modules/scope3/15.2-purchased-feed/has-purchased-feed.input';
import { ServicesInputSchema } from '@/modules/scope3/15.7-services/services.input';
import { OtherPurchasedGoodsAndServicesSchema } from '@/modules/scope3/15.9-other-purchases';
import { numberInput } from '@/tools/inputs';
import { INTENSITIES } from '@/tools/modules';
import { mass } from '@/tools/units';
import z from 'zod';

export const PoultryFlockInputSchema = LivestockActivityInputSchema.extend({
  ...PoultryFlockLivestockInputSchema.shape,
  ...hasFuelInputSchema('fuel').shape,
  ...HasSolidWasteInputSchema.shape,
  ...HasPoultryPurchasedLivestockInputSchema.shape,
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
  eggsSoldKg: numberInput(
    (val) => mass('Eggs', val),
    {
      name: 'eggsSoldKg',
      description: 'Amount of eggs sold',
      modules: [INTENSITIES],
    },
    (s) => s.min(0),
  ),
});

export type PoultryFlockInput = z.input<typeof PoultryFlockInputSchema>;
export type PoultryFlockInputTransformed = z.output<
  typeof PoultryFlockInputSchema
>;
