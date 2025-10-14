import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { deprecated } from '../schemas';
import { GoatSeasonSchema } from './goatseason.input';

export const GoatClassSchema = z
  .object({
    autumn: GoatSeasonSchema,
    winter: GoatSeasonSchema,
    spring: GoatSeasonSchema,
    summer: GoatSeasonSchema,
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
    headShorn: z
      .number()
      .meta({ description: 'Number of goat shorn, in head' }),
    woolShorn: z.number().meta({
      description: 'Weight of wool shorn, in kg/head (kilogram per head)',
    }),
    cleanWoolYield: z.number().meta({
      description:
        'Percentage of clean wool from weight of yield, from 0 to 100',
    }),
    purchases: z.array(LivestockPurchaseSchema).optional(),
  })
  .meta({ description: 'Goat class with seasonal data' });

export type GoatClass = z.infer<typeof GoatClassSchema>;
