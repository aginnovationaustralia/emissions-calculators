import { z } from 'zod';
import { object } from '../schemas';

export const EggSaleSchema = object({
  eggsProduced: z
    .number()
    .min(0)
    .meta({ description: 'Number of eggs produced in a year per bird' }),
  averageWeight: z
    .number()
    .min(0)
    .meta({ description: 'Average egg weight in grams' }),
});

export type EggSale = z.infer<typeof EggSaleSchema>;
