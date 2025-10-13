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
      .optional()
      .meta({
        description: `${DESCRIPTIONS.HEADPURCHASED}. Deprecated note: Use \`purchases\` instead`,
      }),
    purchasedWeight: z
      .number()
      .optional()
      .meta({
        description: `${DESCRIPTIONS.PURCHASEDWEIGHT}. Deprecated note: Use \`purchases\` instead`,
      }),
    source: z
      .enum(LivestockSourceLocations)
      .optional()
      .meta(
        deprecated(
          `Source location of livestock purchase`,
          `Use \`purchases\` instead`,
        ),
      ),
    headSold: z.number().meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z.number().meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(BeefPurchaseSchema),
  })
  .meta({ description: 'Beef class with seasonal data' });

export type BeefClass = z.infer<typeof BeefClassSchema>;
