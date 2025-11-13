import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { BuffaloSeasonSchema } from './buffaloseason.input';

export const BuffaloClassSchema = z
  .object({
    autumn: BuffaloSeasonSchema,
    winter: BuffaloSeasonSchema,
    spring: BuffaloSeasonSchema,
    summer: BuffaloSeasonSchema,
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(LivestockPurchaseSchema).optional(),
  })
  .meta({ description: 'Buffalo class with seasonal data' });

export type BuffaloClass = z.infer<typeof BuffaloClassSchema>;
