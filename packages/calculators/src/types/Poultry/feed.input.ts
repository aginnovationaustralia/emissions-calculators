import { z } from 'zod';
import { object, proportion } from '../schemas';
import { PoultryFeedIngredientsSchema } from './feedingredients.input';

export const PoultryFeedSchema = object({
    ingredients: PoultryFeedIngredientsSchema,
    feedPurchased: z
      .number()
      .min(0)
      .meta({ description: 'Feed purchased, in tonnes' }),
    additionalIngredient: proportion(
      'Fraction of additional ingredients in feed mix, from 0 to 1',
    ),
    emissionIntensity: z.number().min(0).meta({
      description:
        'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
    }),
  })
  .meta({ description: 'Poultry feed' });

export type PoultryFeed = z.infer<typeof PoultryFeedSchema>;
