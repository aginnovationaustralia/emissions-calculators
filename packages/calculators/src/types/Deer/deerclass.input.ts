import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { DeerSeasonSchema } from './deerseason.input';

export const DeerClassSchema = z
  .object({
    autumn: DeerSeasonSchema,
    winter: DeerSeasonSchema,
    spring: DeerSeasonSchema,
    summer: DeerSeasonSchema,
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(LivestockPurchaseSchema).optional(),
  })
  .meta({ description: 'Deer class with seasonal data' });

export type DeerClass = z.infer<typeof DeerClassSchema>;
