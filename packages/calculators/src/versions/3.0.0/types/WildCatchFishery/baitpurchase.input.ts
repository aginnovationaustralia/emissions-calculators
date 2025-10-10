import { z } from 'zod';
import { WildCatchFisheryBait } from '../types';

export const WildCatchFisheryBaitPurchaseSchema = z.object({
  type: z
    .nativeEnum(WildCatchFisheryBait)
    .meta({ description: 'Bait product type' }),
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

export type WildCatchFisheryBaitPurchase = z.infer<
  typeof WildCatchFisheryBaitPurchaseSchema
>;
