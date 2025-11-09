import { z } from 'zod';

export const WildSeaFisheriesCustomBaitPurchaseSchema = z.object({
  purchased: z.number().meta({ description: 'Purchased product in tonnes' }),
  emissionsIntensity: z
    .number()
    .meta({ description: 'Emissions intensity of product, in kg CO2e/kg' }),
});

export type WildSeaFisheriesCustomBaitPurchase = z.infer<
  typeof WildSeaFisheriesCustomBaitPurchaseSchema
>;
