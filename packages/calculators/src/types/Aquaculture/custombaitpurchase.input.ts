import { z } from 'zod';
import { object } from '../schemas';

export const AquacultureCustomBaitPurchaseSchema = object({
  purchasedTonnes: z
    .number()
    .min(0)
    .meta({ description: 'Purchased product in tonnes' }),
  emissionsIntensity: z.number().min(0).meta({
    description: 'Emissions intensity of product, in kg CO2e/kg bait',
  }),
});

export type AquacultureCustomBaitPurchase = z.infer<
  typeof AquacultureCustomBaitPurchaseSchema
>;
