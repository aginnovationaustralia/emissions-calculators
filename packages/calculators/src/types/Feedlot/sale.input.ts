import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';

export const FeedlotSaleSchema = z.object({
  head: z.number().meta({ description: DESCRIPTIONS.HEADSOLD }),
  saleWeight: z.number().meta({ description: DESCRIPTIONS.SALEWEIGHT }),
});

export type FeedlotSale = z.infer<typeof FeedlotSaleSchema>;
