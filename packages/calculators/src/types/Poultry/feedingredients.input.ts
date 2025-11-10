import { z } from 'zod';
import { proportion } from '../schemas';

export const PoultryFeedIngredientsSchema = z
  .object({
    wheat: proportion().optional(),
    barley: proportion().optional(),
    sorghum: proportion().optional(),
    soybean: proportion().optional(),
    millrun: proportion().optional(),
  })
  .meta({
    description:
      'Poultry broiler feed ingredients as fractions, each from 0 to 1',
  });

export type PoultryFeedIngredients = z.infer<
  typeof PoultryFeedIngredientsSchema
>;
