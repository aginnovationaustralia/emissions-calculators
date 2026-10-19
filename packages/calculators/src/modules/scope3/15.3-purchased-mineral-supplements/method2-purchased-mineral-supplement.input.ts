import { numberInput } from '@/tools/inputs';
import { PURCH_MINERAL_15_3 } from '@/tools/modules';
import { massPerMass } from '@/tools/units';
import { z } from 'zod';
import { BasePurchasedMineralSupplementInputSchema } from './base-purchased-mineral-supplement.input';

export const PurchasedMineralSupplementMethod2InputSchema =
  BasePurchasedMineralSupplementInputSchema.extend({
    customEmissionsFactor: numberInput(
      (val) => massPerMass('CO2e', 'Purchased Mineral Supplement', val),
      {
        name: 'custom emissions factor',
        method: '2',
        scope: '3',
        description:
          'Method 2: Emission factor of the type of mineral supplement purchased.',
        modules: [PURCH_MINERAL_15_3],
      },
      (s) => s.min(0),
    ),
  }).meta({ title: 'Method 2' });

export type PurchasedMineralSupplementMethod2Input = z.input<
  typeof PurchasedMineralSupplementMethod2InputSchema
>;
export type PurchasedMineralSupplementMethod2InputTransformed = z.output<
  typeof PurchasedMineralSupplementMethod2InputSchema
>;
