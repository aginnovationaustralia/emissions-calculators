import z from 'zod';

import { object } from '@/types/schemas';
import {
  PurchasedPackagingMethod1InputSchema,
  PurchasedPackagingMethod1InputTransformed,
} from './method1-purchased-packaging.input';
import {
  PurchasedPackagingMethod2InputSchema,
  PurchasedPackagingMethod2InputTransformed,
} from './method2-purchased-packaging.input';

export const PurchasedPackagingInputSchema = z.xor([
  PurchasedPackagingMethod1InputSchema,
  PurchasedPackagingMethod2InputSchema,
]);

export type PurchasedPackagingInput = z.input<
  typeof PurchasedPackagingInputSchema
>;
export type PurchasedPackagingInputTransformed = z.output<
  typeof PurchasedPackagingInputSchema
>;

export const purchasedPackagingIsMethod1 = (
  packaging: PurchasedPackagingInputTransformed,
): packaging is PurchasedPackagingMethod1InputTransformed => {
  return (
    (packaging as PurchasedPackagingMethod1InputTransformed).type !== undefined
  );
};

export const purchasedPackagingIsMethod2 = (
  packaging: PurchasedPackagingInputTransformed,
): packaging is PurchasedPackagingMethod2InputTransformed => {
  return (
    (packaging as PurchasedPackagingMethod2InputTransformed)
      .customEmissionsFactor !== undefined
  );
};

export const PurchasedPackagingsInputSchema = object({
  purchasedPackaging: z.array(PurchasedPackagingInputSchema),
});
export type PurchasedPackagingsInput = z.input<
  typeof PurchasedPackagingsInputSchema
>;
export type PurchasedPackagingsInputTransformed = z.output<
  typeof PurchasedPackagingsInputSchema
>;
