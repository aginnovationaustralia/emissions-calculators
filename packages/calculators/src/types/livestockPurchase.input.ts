import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';
import { object } from './schemas';

export const LivestockPurchaseSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEADPURCHASED }),
  purchaseWeight: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.PURCHASEDWEIGHT }),
});

export type LivestockPurchase = z.infer<typeof LivestockPurchaseSchema>;
