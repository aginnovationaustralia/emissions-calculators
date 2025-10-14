import { z } from 'zod';

export const PoultryFeedIngredientsSchema = z
  .object({
    wheat: z.number().optional(),
    barley: z.number().optional(),
    sorghum: z.number().optional(),
    soybean: z.number().optional(),
    millrun: z.number().optional(),
  })
  .meta({
    description:
      'Poultry broiler feed ingredients as fractions, each from 0 to 1',
  });

export type PoultryFeedIngredients = z.infer<
  typeof PoultryFeedIngredientsSchema
>;
