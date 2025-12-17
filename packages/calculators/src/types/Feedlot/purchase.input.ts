import { FeedlotPurchaseSourceLocations } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const FeedlotPurchaseSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEADPURCHASED }),
  purchaseWeight: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.PURCHASEDWEIGHT }),
  purchaseSource: z
    .enum(FeedlotPurchaseSourceLocations)
    .default('sth NSW/VIC/sth SA')
    .meta({
      description: 'Source location of trading cattle purchases',
    }),
});

export type FeedlotPurchase = z.infer<typeof FeedlotPurchaseSchema>;
