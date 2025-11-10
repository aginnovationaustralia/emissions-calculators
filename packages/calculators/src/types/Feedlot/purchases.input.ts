import { z } from 'zod';
import { FeedlotPurchaseSchema } from './purchase.input';

export const FeedlotPurchasesSchema = z
  .object({
    bullsGt1: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for bulls whose age is greater than 1 year old',
    }),
    bullsGt1Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded bulls whose age is greater than 1 year old',
    }),
    steersLt1: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Steers whose age is less than 1 year old',
    }),
    steersLt1Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Steers whose age is less than 1 year old',
    }),
    steers1To2: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Steers whose age is between 1 and 2 years old',
    }),
    steers1To2Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Steers whose age is between 1 and 2 years old',
    }),
    steersGt2: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Steers whose age is greater than 2 years old',
    }),
    steersGt2Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Steers whose age is greater than 2 years old',
    }),
    cowsGt2: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Cows whose age is greater than 2 years old',
    }),
    cowsGt2Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Cows whose age is greater than 2 years old',
    }),
    heifersLt1: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Heifers whose age is less than 1 year old',
    }),
    heifersLt1Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Heifers whose age is less than 1 year old',
    }),
    heifers1To2: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Heifers whose age is between 1 and 2 years old',
    }),
    heifers1To2Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Heifers whose age is between 1 and 2 years old',
    }),
    heifersGt2: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for Heifers whose age is greater than 2 years old',
    }),
    heifersGt2Traded: z.array(FeedlotPurchaseSchema).optional().meta({
      description:
        'Livestock purchases for traded Heifers whose age is greater than 2 years old',
    }),
  })
  .meta({
    description:
      'Note: passing a single `FeedlotPurchase` for each class is now deprecated, please pass an array (`FeedlotPurchases[]`) instead',
  });

export type FeedlotPurchases = z.infer<typeof FeedlotPurchasesSchema>;
