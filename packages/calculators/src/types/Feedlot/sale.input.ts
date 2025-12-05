import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { object } from '../schemas';

export const FeedlotSaleSchema = object({
  head: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
  saleWeight: z.number().min(0).meta({ description: DESCRIPTIONS.SALEWEIGHT }),
});

export type FeedlotSale = z.infer<typeof FeedlotSaleSchema>;
