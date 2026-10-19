import { numberInput } from '@/tools/inputs';
import { PURCH_FEED_15_2 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';

export const BasePurchasedFeedInputSchema = object({
  amount: numberInput(
    (val) => mass('Purchased Feed', tonnesToKg(val)),
    {
      name: 'feed quantity',
      description: 'Quantity of this type of feed purchased.',
      modules: [PURCH_FEED_15_2],
    },
    (s) => s.min(0),
  ),
});
