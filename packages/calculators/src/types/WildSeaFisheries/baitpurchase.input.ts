import { WildSeaFisheriesBaits } from '@/types/enums';
import { z } from 'zod';
import { proportion } from '../schemas';

export const WildSeaFisheriesBaitPurchaseSchema = z.object({
  type: z
    .enum(WildSeaFisheriesBaits)
    .meta({ description: 'Bait product type' }),
  purchased: z.number().meta({ description: 'Purchased product in tonnes' }),
  additionalIngredient: proportion(
    'Additional ingredient fraction, from 0 to 1',
  ),
  emissionsIntensity: z
    .number()
    .meta({ description: 'Emissions intensity of product, in kg CO2e/kg' }),
});

export type WildSeaFisheriesBaitPurchase = z.infer<
  typeof WildSeaFisheriesBaitPurchaseSchema
>;
