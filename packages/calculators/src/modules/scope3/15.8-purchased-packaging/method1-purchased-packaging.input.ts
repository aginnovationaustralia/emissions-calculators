import { input } from '@/tools/inputs';
import { z } from 'zod';
import {
  PurchasedPackagingType,
  PurchasedPackagingTypes,
} from '@/constants/enums';
import { BasePurchasedPackagingInputSchema } from './base-purchased-packaging.input';

export const PurchasedPackagingMethod1InputSchema =
  BasePurchasedPackagingInputSchema.extend({
    type: z
      .literal(PurchasedPackagingTypes)
      .transform((val) =>
        input('Purchased packaging type', val as PurchasedPackagingType),
      )
      .meta({
        description: 'The type of packaging purchased.',
      }),
  });
export type PurchasedPackagingMethod1Input = z.input<
  typeof PurchasedPackagingMethod1InputSchema
>;
export type PurchasedPackagingMethod1InputTransformed = z.output<
  typeof PurchasedPackagingMethod1InputSchema
>;
