import { z } from 'zod';
import { LivestockSourceLocations } from '../livestock';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';

export const BeefPurchaseSchema = LivestockPurchaseSchema.extend({
  purchaseSource: z
    .enum(LivestockSourceLocations)
    .meta({ description: 'Source location of livestock purchase' }),
}).meta({ description: 'Beef purchase' });

export type BeefPurchase = z.infer<typeof BeefPurchaseSchema>;
