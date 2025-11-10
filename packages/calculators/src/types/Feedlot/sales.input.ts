import { z } from 'zod';
import { FeedlotSaleSchema } from './sale.input';

export const FeedlotSalesSchema = z
  .object({
    bullsGt1: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for bulls whose age is greater than 1 year old',
    }),
    bullsGt1Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded bulls whose age is greater than 1 year old',
    }),
    steersLt1: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Steers whose age is less than 1 year old',
    }),
    steersLt1Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Steers whose age is less than 1 year old',
    }),
    steers1To2: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Steers whose age is between 1 and 2 years old',
    }),
    steers1To2Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Steers whose age is between 1 and 2 years old',
    }),
    steersGt2: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Steers whose age is greater than 2 years old',
    }),
    steersGt2Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Steers whose age is greater than 2 years old',
    }),
    cowsGt2: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Cows whose age is greater than 2 years old',
    }),
    cowsGt2Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Cows whose age is greater than 2 years old',
    }),
    heifersLt1: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Heifers whose age is less than 1 year old',
    }),
    heifersLt1Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Heifers whose age is less than 1 year old',
    }),
    heifers1To2: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Heifers whose age is between 1 and 2 years old',
    }),
    heifers1To2Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Heifers whose age is between 1 and 2 years old',
    }),
    heifersGt2: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for Heifers whose age is greater than 2 years old',
    }),
    heifersGt2Traded: z.array(FeedlotSaleSchema).meta({
      description:
        'Livestock sales for traded Heifers whose age is greater than 2 years old',
    }),
  })
  .meta({
    description:
      'Note: passing a single `FeedlotSale` for each class is now deprecated, please pass an array (`FeedlotSales[]`) instead',
  });

export type FeedlotSales = z.infer<typeof FeedlotSalesSchema>;
