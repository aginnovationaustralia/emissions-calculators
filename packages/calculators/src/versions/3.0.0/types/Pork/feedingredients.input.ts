import { z } from 'zod';

export const FeedIngredientsSchema = z
  .object({
    wheat: z.number().min(0).max(1).optional(),
    barley: z.number().min(0).max(1).optional(),
    wheyPowder: z.number().min(0).max(1).optional(),
    canolaMeal: z.number().min(0).max(1).optional(),
    soybeanMeal: z.number().min(0).max(1).optional(),
    meatMeal: z.number().min(0).max(1).optional(),
    bloodMeal: z.number().min(0).max(1).optional(),
    fishmeal: z.number().min(0).max(1).optional(),
    tallow: z.number().min(0).max(1).optional(),
    wheatBran: z.number().min(0).max(1).optional(),
    beetPulp: z.number().min(0).max(1).optional(),
    millMix: z.number().min(0).max(1).optional(),
  })
  .meta({
    description:
      'Feed product ingredients, each ingredient is a fraction from 0 to 1',
  });

export type FeedIngredients = z.infer<typeof FeedIngredientsSchema>;
