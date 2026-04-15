import { input } from '@/tools/inputs';
import { z } from 'zod';
import { BasePurchasedMineralSupplementInputSchema } from './base-purchased-mineral-supplement.input';
import {
  PurchasedMineralSupplementType,
  PurchasedMineralSupplementTypes,
} from '@/constants/enums';

export const PurchasedMineralSupplementMethod1InputSchema =
  BasePurchasedMineralSupplementInputSchema.extend({
    type: z
      .literal(PurchasedMineralSupplementTypes)
      .transform((val) =>
        input(
          'purchased mineral supplement type',
          val as PurchasedMineralSupplementType,
        ),
      )
      .meta({
        description: 'The type of mineral supplement purchased.',
      }),
  });
export type PurchasedMineralSupplementMethod1Input = z.input<
  typeof PurchasedMineralSupplementMethod1InputSchema
>;
export type PurchasedMineralSupplementMethod1InputTransformed = z.output<
  typeof PurchasedMineralSupplementMethod1InputSchema
>;
