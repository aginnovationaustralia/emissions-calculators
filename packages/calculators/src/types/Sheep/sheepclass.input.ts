import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { deprecated, percentage } from '../schemas';
import { SheepSeasonSchema } from './sheepseason.input';

export const SheepClassSchema = z.object({
  autumn: SheepSeasonSchema,
  winter: SheepSeasonSchema,
  spring: SheepSeasonSchema,
  summer: SheepSeasonSchema,
  headShorn: z
    .number()
    .min(0)
    .meta({ description: 'Number of sheep shorn, in head' }),
  woolShorn: z.number().min(0).meta({
    description: 'Weight of wool shorn, in kg/head (kilogram per head)',
  }),
  cleanWoolYield: percentage(
    'Percentage of clean wool from weight of yield, from 0 to 100',
  ),
  headPurchased: z
    .number()
    .min(0)
    .optional()
    .meta(
      deprecated(DESCRIPTIONS.HEADPURCHASED, 'Please use `purchases` instead'),
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
  saleWeight: z.number().min(0).meta({ description: DESCRIPTIONS.SALEWEIGHT }),
  purchases: z.array(LivestockPurchaseSchema).optional(),
});

export type SheepClass = z.infer<typeof SheepClassSchema>;
