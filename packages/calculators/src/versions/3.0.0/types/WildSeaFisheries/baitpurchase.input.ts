import { z } from 'zod';
import { WildSeaFisheriesBaits } from '../types';

export const WildSeaFisheriesBaitPurchaseSchema = z.object({
  type: z
    .enum(WildSeaFisheriesBaits)
    .meta({ description: 'Bait product type' }),
  purchased: z.number().meta({ description: 'Purchased product in tonnes' }),
  additionalIngredient: z
    .number()
    .min(0)
    .max(1)
    .meta({ description: 'Additional ingredient fraction, from 0 to 1' }),
  emissionsIntensity: z
    .number()
    .meta({ description: 'Emissions intensity of product, in kg CO2e/kg' }),
});

export type WildSeaFisheriesBaitPurchase = z.infer<
  typeof WildSeaFisheriesBaitPurchaseSchema
>;
