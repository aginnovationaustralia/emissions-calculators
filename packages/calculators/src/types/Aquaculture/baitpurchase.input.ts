import { AquacultureBait } from '@/types/enums';
import { z } from 'zod';
import { object, proportion } from '../schemas';

export const AquacultureBaitPurchaseSchema = object({
  type: z.enum(AquacultureBait).meta({ description: 'Bait product type' }),
  purchasedTonnes: z
    .number()
    .min(0)
    .meta({ description: 'Purchased product in tonnes' }),
  additionalIngredients: proportion(
    'Additional ingredient fraction, from 0 to 1',
  ),
  emissionsIntensity: z.number().optional().default(0).meta({
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
