import { input } from '@/tools/inputs';
import { mass } from '@/tools/units';
import { z } from 'zod';
import { BasePurchasedPackagingInputSchema } from './base-purchased-packaging.input';

export const PurchasedPackagingMethod2InputSchema =
  BasePurchasedPackagingInputSchema.extend({
    customEmissionsFactor: z
      .number()
      .min(0)
      .transform((val) => input('custom emissions factor', mass('CO2e', val)))
      .meta({
        description:
          'Method 2: Emission factor of the type of packaging purchased, in kg CO2e/unit.',
      }),
  });

export type PurchasedPackagingMethod2Input = z.input<
  typeof PurchasedPackagingMethod2InputSchema
>;
export type PurchasedPackagingMethod2InputTransformed = z.output<
  typeof PurchasedPackagingMethod2InputSchema
>;
