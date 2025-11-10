import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockManureSchema } from '../livestockManure.input';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { deprecated } from '../schemas';

export const PorkClassSchema = z
  .object({
    autumn: z.number().meta({ description: 'Pig numbers in autumn' }),
    winter: z.number().meta({ description: 'Pig numbers in winter' }),
    spring: z.number().meta({ description: 'Pig numbers in spring' }),
    summer: z.number().meta({ description: 'Pig numbers in summer' }),
    headPurchased: z
      .number()
      .optional()
      .meta(
        deprecated(
          DESCRIPTIONS.HEADPURCHASED,
          'Please use `purchases` instead',
        ),
      ),
    purchasedWeight: z
      .number()
      .optional()
      .meta(
        deprecated(
          DESCRIPTIONS.PURCHASEDWEIGHT,
          'Please use `purchases` instead',
        ),
      ),
    headSold: z.number().meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z.number().meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(LivestockPurchaseSchema).optional(),
    manure: LivestockManureSchema,
  })
  .meta({ description: 'Pork class with seasonal data' });

export type PorkClass = z.infer<typeof PorkClassSchema>;
