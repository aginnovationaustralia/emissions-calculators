import { z } from 'zod';
import { AquacultureBait } from '../types';

export const AquacultureBaitPurchaseSchema = z.object({
  type: z.enum(AquacultureBait).meta({ description: 'Bait product type' }),
  purchasedTonnes: z
    .number()
    .meta({ description: 'Purchased product in tonnes' }),
  additionalIngredients: z
    .number()
    .min(0)
    .max(1)
    .meta({ description: 'Additional ingredient fraction, from 0 to 1' }),
  emissionsIntensity: z.number().default(0).meta({
    description:
      'Emissions intensity of additional ingredients, in kg CO2e/kg bait (default 0)',
  }),
});

export type AquacultureBaitPurchase = z.output<
  typeof AquacultureBaitPurchaseSchema
>;

export type AquacultureBaitPurchaseInput = z.input<
  typeof AquacultureBaitPurchaseSchema
>;
