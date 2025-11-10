import { z } from 'zod';

export const EggSaleSchema = z.object({
  eggsProduced: z
    .number()
    .meta({ description: 'Number of eggs produced in a year per bird' }),
  averageWeight: z
    .number()
    .meta({ description: 'Average egg weight in grams' }),
});

export type EggSale = z.infer<typeof EggSaleSchema>;
