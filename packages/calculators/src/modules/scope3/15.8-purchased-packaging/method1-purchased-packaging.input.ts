import {
  PurchasedPackagingByUnitsTypes,
  PurchasedPackagingByMassTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { PACKAGING_15_8 } from '@/tools/modules';
import { enumSchema } from '@/tools/enum-schemas';
import { z } from 'zod';
import {
  BasePurchasedPackagingByMassInputSchema,
  BasePurchasedPackagingByUnitsInputSchema,
} from './base-purchased-packaging.input';

export const PurchasedPackagingByUnitsMethod1InputSchema =
  BasePurchasedPackagingByUnitsInputSchema.extend({
    type: enumSchema(PurchasedPackagingByUnitsTypes)
      .transform((val) =>
        input(val, {
          name: 'Purchased packaging type',
          modules: [PACKAGING_15_8],
        }),
      )
      .meta({
        description: 'The type of packaging purchased.',
      }),
  }).meta({ title: 'Quantity by units' });
export type PurchasedPackagingByUnitsMethod1Input = z.input<
  typeof PurchasedPackagingByUnitsMethod1InputSchema
>;
export type PurchasedPackagingByUnitsMethod1InputTransformed = z.output<
  typeof PurchasedPackagingByUnitsMethod1InputSchema
>;

export const PurchasedPackagingByMassMethod1InputSchema =
  BasePurchasedPackagingByMassInputSchema.extend({
    type: enumSchema(PurchasedPackagingByMassTypes)
      .transform((val) =>
        input(val, {
          name: 'Purchased packaging type',
          modules: [PACKAGING_15_8],
        }),
      )
      .meta({
        description: 'The type of packaging purchased.',
      }),
  }).meta({ title: 'Quantity by mass' });
export type PurchasedPackagingByMassMethod1Input = z.input<
  typeof PurchasedPackagingByMassMethod1InputSchema
>;
export type PurchasedPackagingByMassMethod1InputTransformed = z.output<
  typeof PurchasedPackagingByMassMethod1InputSchema
>;

export const PurchasedPackagingMethod1InputSchema = z
  .discriminatedUnion('type', [
    PurchasedPackagingByUnitsMethod1InputSchema,
    PurchasedPackagingByMassMethod1InputSchema,
  ])
  .meta({ title: 'Method 1 (by packaging type)' });
export type PurchasedPackagingMethod1Input = z.input<
  typeof PurchasedPackagingMethod1InputSchema
>;
export type PurchasedPackagingMethod1InputTransformed = z.output<
  typeof PurchasedPackagingMethod1InputSchema
>;
