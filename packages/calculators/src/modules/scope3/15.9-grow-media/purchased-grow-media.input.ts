import z from 'zod';
import {
  PurchasedGrowMediaMethod1InputSchema,
  PurchasedGrowMediaMethod1InputTransformed,
} from './method1-purchased-grow-media.input';
import {
  PurchasedGrowMediaMethod2InputSchema,
  PurchasedGrowMediaMethod2InputTransformed,
} from './method2-purchased-grow-media.input';
import { object } from '@/types/schemas';

export const PurchasedGrowMediaInputSchema = z.xor([
  PurchasedGrowMediaMethod1InputSchema,
  PurchasedGrowMediaMethod2InputSchema,
]);

export type PurchasedGrowMediaInput = z.input<
  typeof PurchasedGrowMediaInputSchema
>;
export type PurchasedGrowMediaInputTransformed = z.output<
  typeof PurchasedGrowMediaInputSchema
>;

export const purchasedGrowMediaIsMethod1 = (
  growMedia: PurchasedGrowMediaInputTransformed,
): growMedia is PurchasedGrowMediaMethod1InputTransformed => {
  return (
    (growMedia as PurchasedGrowMediaMethod1InputTransformed).type !== undefined
  );
};

export const purchasedGrowMediaIsMethod2 = (
  growMedia: PurchasedGrowMediaInputTransformed,
): growMedia is PurchasedGrowMediaMethod2InputTransformed => {
  return (
    (growMedia as PurchasedGrowMediaMethod1InputTransformed).type === undefined
  );
};

export const PurchasedGrowMediasInputSchema = object({
  purchasedGrowMedia: z.array(PurchasedGrowMediaInputSchema),
});
export type PurchasedGrowMediasInput = z.input<
  typeof PurchasedGrowMediasInputSchema
>;
export type PurchasedGrowMediasInputTransformed = z.output<
  typeof PurchasedGrowMediasInputSchema
>;
