import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockManureSchema } from '../livestockManure.input';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';

export const PorkClassSchema = z
  .object({
    autumn: z.number().min(0).meta({ description: 'Pig numbers in autumn' }),
    winter: z.number().min(0).meta({ description: 'Pig numbers in winter' }),
    spring: z.number().min(0).meta({ description: 'Pig numbers in spring' }),
    summer: z.number().min(0).meta({ description: 'Pig numbers in summer' }),
    headSold: z.number().min(0).meta({ description: DESCRIPTIONS.HEADSOLD }),
    saleWeight: z
      .number()
      .min(0)
      .meta({ description: DESCRIPTIONS.SALEWEIGHT }),
    purchases: z.array(LivestockPurchaseSchema).optional(),
    manure: LivestockManureSchema,
  })
  .meta({ description: 'Pork class with seasonal data' });

export type PorkClass = z.infer<typeof PorkClassSchema>;
