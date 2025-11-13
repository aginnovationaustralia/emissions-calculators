import { z } from 'zod';
import { proportion } from '../schemas';
import { FeedIngredientsSchema } from './feedingredients.input';

export const FeedSchema = z
  .object({
    feedPurchased: z
      .number()
      .min(0)
      .meta({ description: 'Pig feed purchased, in tonnes' }),
    additionalIngredients: proportion(
      'Fraction of additional ingredient in feed mix, from 0 to 1',
    ),
    emissionsIntensity: z.number().min(0).meta({
      description:
        'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
    }),
    ingredients: FeedIngredientsSchema,
  })
  .meta({ description: 'Pig feed product' });

export type Feed = z.infer<typeof FeedSchema>;
