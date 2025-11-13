import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockSourceLocations } from '../livestock';
import { deprecated } from '../schemas';
import { BeefPurchaseSchema } from './beefpurchase.input';
import { BeefSeasonSchema } from './beefseason.input';

export const BeefClassSchema = z
  .object({
    autumn: BeefSeasonSchema,
    winter: BeefSeasonSchema,
    spring: BeefSeasonSchema,
    summer: BeefSeasonSchema,
    headPurchased: z
      .number()
      .min(0)
      .optional()
      .meta(deprecated(DESCRIPTIONS.HEADPURCHASED, 'Use `purchases` instead')),
    purchasedWeight: z
      .number()
      .min(0)
      .optional()
      .meta(
        deprecated(DESCRIPTIONS.PURCHASEDWEIGHT, 'Use `purchases` instead'),
      ),
    source: z
      .enum(LivestockSourceLocations)
      .optional()
      .meta(
        deprecated(
          `Source location of livestock purchase`,
          `Use \`purchases\` instead`,
        ),
      ),
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(BeefPurchaseSchema).optional(),
  })
  .meta({ description: 'Beef class with seasonal data' });

export type BeefClass = z.infer<typeof BeefClassSchema>;
