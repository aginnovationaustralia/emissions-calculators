import { numberInput } from '@/tools/inputs';
import { PURCH_MINERAL_15_3 } from '@/tools/modules';
import { tonnesToKg } from '@/tools/unit-conversion';
import { mass } from '@/tools/units';
import { object } from '@/types/schemas';

export const BasePurchasedMineralSupplementInputSchema = object({
  amount: numberInput(
    (val) => mass('Purchased Mineral Supplement', tonnesToKg(val)),
    {
      name: 'feed quantity',
      description: 'Quantity of this type of mineral supplement purchased.',
      modules: [PURCH_MINERAL_15_3],
    },
    (s) => s.min(0),
  ),
});
