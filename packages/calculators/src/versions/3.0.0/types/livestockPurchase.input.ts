import { z } from 'zod';
import { DESCRIPTIONS } from './descriptions.schema';

export const LivestockPurchaseSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEADPURCHASED }),
  purchaseWeight: z
    .number()
    .meta({ description: DESCRIPTIONS.PURCHASEDWEIGHT }),
});

export type LivestockPurchase = z.infer<typeof LivestockPurchaseSchema>;
