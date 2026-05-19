import z from 'zod';
import {
  BasePurchasedLivestockMethod1InputSchema,
  BasePurchasedLivestockMethod2InputSchema,
} from './base-purchased-livestock';
import { OtherLivestockTypes } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { object } from '@/types/schemas';

export const OtherPurchasedLivestockMethod1InputSchema =
  BasePurchasedLivestockMethod1InputSchema.extend({
    type: z
      .literal(OtherLivestockTypes)
      .transform((val) => input('purchased livestock type', val)),
  });
export type OtherPurchasedLivestockMethod1Input = z.input<
  typeof OtherPurchasedLivestockMethod1InputSchema
>;
export type OtherPurchasedLivestockMethod1InputTransformed = z.output<
  typeof OtherPurchasedLivestockMethod1InputSchema
>;

export const OtherPurchasedLivestockMethod2InputSchema =
  BasePurchasedLivestockMethod2InputSchema.extend({
    type: z
      .literal(OtherLivestockTypes)
      .transform((val) => input('purchased livestock type', val)),
  });
export type OtherPurchasedLivestockMethod2Input = z.input<
  typeof OtherPurchasedLivestockMethod2InputSchema
>;
export type OtherPurchasedLivestockMethod2InputTransformed = z.output<
  typeof OtherPurchasedLivestockMethod2InputSchema
>;

export const OtherPurchasedLivestockInputSchema = z.xor([
  OtherPurchasedLivestockMethod1InputSchema,
  OtherPurchasedLivestockMethod2InputSchema,
]);

export type OtherPurchasedLivestockInput = z.input<
  typeof OtherPurchasedLivestockInputSchema
>;
export type OtherPurchasedLivestockInputTransformed = z.output<
  typeof OtherPurchasedLivestockInputSchema
>;

export const otherPurchasedLivestockIsMethod1 = (
  purchase: OtherPurchasedLivestockInputTransformed,
): purchase is OtherPurchasedLivestockMethod1InputTransformed => {
  return purchase.calculationMethod === '1';
};
export const otherPurchasedLivestockIsMethod2 = (
  purchase: OtherPurchasedLivestockInputTransformed,
): purchase is OtherPurchasedLivestockMethod2InputTransformed => {
  return purchase.calculationMethod === '2';
};

export const OtherPurchasedLivestocksInputSchema = object({
  livestockPurchases: z.array(OtherPurchasedLivestockInputSchema),
});
export type OtherPurchasedLivestocksInput = z.input<
  typeof OtherPurchasedLivestocksInputSchema
>;
export type OtherPurchasedLivestocksInputTransformed = z.output<
  typeof OtherPurchasedLivestocksInputSchema
>;
