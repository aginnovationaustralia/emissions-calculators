import { FeedlotPurchaseSourceLocations } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const FeedlotPurchaseSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEADPURCHASED }),
  purchaseWeight: z
    .number()
    .meta({ description: DESCRIPTIONS.PURCHASEDWEIGHT }),
  purchaseSource: z
    .enum(FeedlotPurchaseSourceLocations)
    .default('sth NSW/VIC/sth SA')
    .meta({
      description: 'Source location of trading cattle purchases',
    }),
});

export type FeedlotPurchase = z.infer<typeof FeedlotPurchaseSchema>;
