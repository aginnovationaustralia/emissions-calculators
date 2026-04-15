import { input } from '@/tools/inputs';
import { massPerMass } from '@/tools/units';
import { z } from 'zod';
import { BasePurchasedMineralSupplementInputSchema } from './base-purchased-mineral-supplement.input';

export const PurchasedMineralSupplementMethod2InputSchema =
  BasePurchasedMineralSupplementInputSchema.extend({
    customEmissionsFactor: z
      .number()
      .min(0)
      .transform((val) =>
        input(
          'custom emissions factor',
          massPerMass('CO2e', 'Purchased Mineral Supplement', val),
        ),
      )
      .meta({
        description:
          'Method 2: Emission factor of the type of mineral supplement purchased, in kg CO2e/kg.',
      }),
  });

export type PurchasedMineralSupplementMethod2Input = z.input<
  typeof PurchasedMineralSupplementMethod2InputSchema
>;
export type PurchasedMineralSupplementMethod2InputTransformed = z.output<
  typeof PurchasedMineralSupplementMethod2InputSchema
>;
