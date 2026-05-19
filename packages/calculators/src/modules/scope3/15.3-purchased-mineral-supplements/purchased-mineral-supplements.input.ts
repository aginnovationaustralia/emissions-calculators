import z from 'zod';
import {
  PurchasedMineralSupplementMethod1InputSchema,
  PurchasedMineralSupplementMethod1InputTransformed,
} from './method1-purchased-mineral-supplement.input';
import {
  PurchasedMineralSupplementMethod2InputSchema,
  PurchasedMineralSupplementMethod2InputTransformed,
} from './method2-purchased-mineral-supplement.input';
import { object } from '@/types/schemas';

export const PurchasedMineralSupplementInputSchema = z.xor([
  PurchasedMineralSupplementMethod1InputSchema,
  PurchasedMineralSupplementMethod2InputSchema,
]);

export type PurchasedMineralSupplementInput = z.input<
  typeof PurchasedMineralSupplementInputSchema
>;
export type PurchasedMineralSupplementInputTransformed = z.output<
  typeof PurchasedMineralSupplementInputSchema
>;

export const purchasedMineralSupplementIsMethod1 = (
  mineral: PurchasedMineralSupplementInputTransformed,
): mineral is PurchasedMineralSupplementMethod1InputTransformed => {
  return (
    (mineral as PurchasedMineralSupplementMethod1InputTransformed).type !==
    undefined
  );
};

export const purchasedMineralSupplementIsMethod2 = (
  mineral: PurchasedMineralSupplementInputTransformed,
): mineral is PurchasedMineralSupplementMethod2InputTransformed => {
  return (
    (mineral as PurchasedMineralSupplementMethod2InputTransformed)
      .customEmissionsFactor !== undefined
  );
};

export const PurchasedMineralSupplementsInputSchema = object({
  purchasedMineralSupplements: z.array(PurchasedMineralSupplementInputSchema),
});
export type PurchasedMineralSupplementsInput = z.input<
  typeof PurchasedMineralSupplementsInputSchema
>;
export type PurchasedMineralSupplementsInputTransformed = z.output<
  typeof PurchasedMineralSupplementsInputSchema
>;
