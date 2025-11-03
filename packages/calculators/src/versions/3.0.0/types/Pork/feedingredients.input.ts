import { z } from 'zod';
import { proportion } from '../schemas';

export const FeedIngredientsSchema = z
  .object({
    wheat: proportion().optional(),
    barley: proportion().optional(),
    wheyPowder: proportion().optional(),
    canolaMeal: proportion().optional(),
    soybeanMeal: proportion().optional(),
    meatMeal: proportion().optional(),
    bloodMeal: proportion().optional(),
    fishmeal: proportion().optional(),
    tallow: proportion().optional(),
    wheatBran: proportion().optional(),
    beetPulp: proportion().optional(),
    millMix: proportion().optional(),
  })
  .meta({
    description:
      'Feed product ingredients, each ingredient is a fraction from 0 to 1',
  });

export type FeedIngredients = z.infer<typeof FeedIngredientsSchema>;
