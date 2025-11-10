import { z } from 'zod';
import { PoultryFeedIngredientsSchema } from './feedingredients.input';

export const PoultryFeedSchema = z
  .object({
    ingredients: PoultryFeedIngredientsSchema,
    feedPurchased: z
      .number()
      .meta({ description: 'Feed purchased, in tonnes' }),
    additionalIngredient: z.number().meta({
      description:
        'Fraction of additional ingredients in feed mix, from 0 to 1',
    }),
    emissionIntensity: z.number().meta({
      description:
        'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
    }),
  })
  .meta({ description: 'Poultry feed' });

export type PoultryFeed = z.infer<typeof PoultryFeedSchema>;
