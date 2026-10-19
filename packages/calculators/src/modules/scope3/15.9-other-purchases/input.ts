import { numberInput } from '@/tools/inputs';
import { OTHER_PURCH_15_9 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

export const OtherPurchasedGoodOrServiceSchema = object({
  quantity: numberInput(
    (val) => realNumber(val),
    {
      name: 'Quantity of other item',
      description:
        'The quantity of the goods or services purchased, in any appropriate unit. Note that the unit MUST correspond with the unit of the provided emissions factor.',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
  emissionsFactor: numberInput(
    (val) => mass('CO2e', tonnesToKg(val)),
    {
      name: 'Emissions factor per quantity of other item',
      scope: '3',
      description:
        'The emissions factor for the purchased goods or services, per unit of good or service.',
      modules: [OTHER_PURCH_15_9],
    },
    (s) => s.min(0),
  ),
});
export type OtherPurchasedGoodOrServiceInput = z.input<
  typeof OtherPurchasedGoodOrServiceSchema
>;
export type OtherPurchasedGoodOrServiceInputTransformed = z.output<
  typeof OtherPurchasedGoodOrServiceSchema
>;

export const OtherPurchasedGoodsAndServicesSchema = object({
  otherPurchasedGoodsAndServices: z
    .array(OtherPurchasedGoodOrServiceSchema)
    .optional()
    .meta({
      description: `Data for any additional purchased goods or services that were used within the reporting period for this enterprise that can't be captured by other inputs.`,
    }),
});
export type OtherPurchasedGoodsAndServicesInput = z.input<
  typeof OtherPurchasedGoodsAndServicesSchema
>;
export type OtherPurchasedGoodsAndServicesInputTransformed = z.output<
  typeof OtherPurchasedGoodsAndServicesSchema
>;
