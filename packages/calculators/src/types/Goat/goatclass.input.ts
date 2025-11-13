import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { deprecated, percentage } from '../schemas';
import { GoatSeasonSchema } from './goatseason.input';

export const GoatClassSchema = z
  .object({
    autumn: GoatSeasonSchema,
    winter: GoatSeasonSchema,
    spring: GoatSeasonSchema,
    summer: GoatSeasonSchema,
    headPurchased: z
      .number()
      .min(0)
      .optional()
      .meta(
        deprecated(
          DESCRIPTIONS.HEADPURCHASED,
          'Please use `purchases` instead',
        ),
      ),
    purchasedWeight: z
      .number()
      .min(0)
      .optional()
      .meta(
        deprecated(
          DESCRIPTIONS.PURCHASEDWEIGHT,
          'Please use `purchases` instead',
        ),
      ),
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    headShorn: z
      .number()
      .min(0)
      .meta({ description: 'Number of goat shorn, in head' }),
    woolShorn: z.number().min(0).meta({
      description: 'Weight of wool shorn, in kg/head (kilogram per head)',
    }),
    cleanWoolYield: percentage(
      'Percentage of clean wool from weight of yield, from 0 to 100',
    ),
    purchases: z.array(LivestockPurchaseSchema).optional(),
  })
  .meta({ description: 'Goat class with seasonal data' });

export type GoatClass = z.infer<typeof GoatClassSchema>;
