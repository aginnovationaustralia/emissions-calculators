import { z } from 'zod';
import { FeedIngredientsSchema } from './feedingredients.input';

export const FeedSchema = z
  .object({
    feedPurchased: z
      .number()
      .meta({ description: 'Pig feed purchased, in tonnes' }),
    additionalIngredients: z.number().min(0).max(1).meta({
      description: 'Fraction of additional ingredient in feed mix, from 0 to 1',
    }),
    emissionsIntensity: z.number().meta({
      description:
        'Emissions intensity of feed product in GHG (kg CO2-e/kg input)',
    }),
    ingredients: FeedIngredientsSchema,
  })
  .meta({ description: 'Pig feed product' });

export type Feed = z.infer<typeof FeedSchema>;
