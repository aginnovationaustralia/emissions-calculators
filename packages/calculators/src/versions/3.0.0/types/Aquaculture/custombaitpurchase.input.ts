import { z } from 'zod';

export const AquacultureCustomBaitPurchaseSchema = z.object({
  purchasedTonnes: z
    .number()
    .meta({ description: 'Purchased product in tonnes' }),
  emissionsIntensity: z
    .number()
    .meta({
      description: 'Emissions intensity of product, in kg CO2e/kg bait',
    }),
});

export type AquacultureCustomBaitPurchase = z.infer<
  typeof AquacultureCustomBaitPurchaseSchema
>;
