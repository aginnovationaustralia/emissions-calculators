import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { SheepSeasonSchema } from './sheepseason.input';

export const SheepClassSchema = z.object({
  autumn: SheepSeasonSchema,
  winter: SheepSeasonSchema,
  spring: SheepSeasonSchema,
  summer: SheepSeasonSchema,
  headShorn: z.number().meta({ description: 'Number of sheep shorn, in head' }),
  woolShorn: z
    .number()
    .meta({
      description: 'Weight of wool shorn, in kg/head (kilogram per head)',
    }),
  cleanWoolYield: z.number().meta({
    description: 'Percentage of clean wool from weight of yield, from 0 to 100',
  }),
  headPurchased: z
    .number()
    .optional()
    .meta({
      description: `${DESCRIPTIONS.HEADPURCHASED}. Deprecated note: Please use \`purchases\` instead`,
    }),
  purchasedWeight: z
    .number()
    .optional()
    .meta({
      description: `${DESCRIPTIONS.PURCHASEDWEIGHT}. Deprecated note: Please use \`purchases\` instead`,
    }),
  headSold: z.number().meta({ description: DESCRIPTIONS.HEADSOLD }),
  saleWeight: z.number().meta({ description: DESCRIPTIONS.SALEWEIGHT }),
  purchases: z.array(LivestockPurchaseSchema).optional(),
});

export type SheepClass = z.infer<typeof SheepClassSchema>;
