import { WildCatchFisheryBait } from '@/types/enums';
import { z } from 'zod';
import { proportion } from '../schemas';

export const WildCatchFisheryBaitPurchaseSchema = z.object({
  type: z.enum(WildCatchFisheryBait).meta({ description: 'Bait product type' }),
  purchasedTonnes: z
    .number()
    .min(0)
    .meta({ description: 'Purchased product in tonnes' }),
  additionalIngredients: proportion(
    'Additional ingredient fraction, from 0 to 1',
  ),
  emissionsIntensity: z.number().min(0).default(0).meta({
    description:
      'Emissions intensity of additional ingredients, in kg CO2e/kg bait (default 0)',
  }),
});

export type WildCatchFisheryBaitPurchase = z.infer<
  typeof WildCatchFisheryBaitPurchaseSchema
>;
