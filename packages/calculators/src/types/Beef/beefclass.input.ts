import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { BeefPurchaseSchema } from './beefpurchase.input';
import { BeefSeasonSchema } from './beefseason.input';

export const BeefClassSchema = z
  .object({
    autumn: BeefSeasonSchema,
    winter: BeefSeasonSchema,
    spring: BeefSeasonSchema,
    summer: BeefSeasonSchema,
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(BeefPurchaseSchema).optional(),
  })
  .meta({ description: 'Beef class with seasonal data' });

export type BeefClass = z.infer<typeof BeefClassSchema>;
