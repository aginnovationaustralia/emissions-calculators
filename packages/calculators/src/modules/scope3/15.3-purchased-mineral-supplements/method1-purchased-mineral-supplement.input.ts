import {
  PurchasedMineralSupplementType,
  PurchasedMineralSupplementTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { PURCH_MINERAL_15_3 } from '@/tools/modules';
import { enumSchema } from '@/tools/enum-schemas';
import { z } from 'zod';
import { BasePurchasedMineralSupplementInputSchema } from './base-purchased-mineral-supplement.input';

export const PurchasedMineralSupplementMethod1InputSchema =
  BasePurchasedMineralSupplementInputSchema.extend({
    type: enumSchema(PurchasedMineralSupplementTypes)
      .transform((val) =>
        input(val as PurchasedMineralSupplementType, {
          name: 'purchased mineral supplement type',
          modules: [PURCH_MINERAL_15_3],
        }),
      )
      .meta({
        description: 'The type of mineral supplement purchased.',
      }),
  }).meta({ title: 'Method 1' });
export type PurchasedMineralSupplementMethod1Input = z.input<
  typeof PurchasedMineralSupplementMethod1InputSchema
>;
export type PurchasedMineralSupplementMethod1InputTransformed = z.output<
  typeof PurchasedMineralSupplementMethod1InputSchema
>;
