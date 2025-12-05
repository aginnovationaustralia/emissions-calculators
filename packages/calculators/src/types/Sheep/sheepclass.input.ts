import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { object, percentage } from '../schemas';
import { SheepSeasonSchema } from './sheepseason.input';

export const SheepClassSchema = object({
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
  headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
  saleWeight: z.number().min(0).meta({ description: DESCRIPTIONS.SALEWEIGHT }),
  purchases: z.array(LivestockPurchaseSchema).optional(),
});

export type SheepClass = z.infer<typeof SheepClassSchema>;
