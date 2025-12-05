import { z } from 'zod';
import { object } from '../schemas';
import { BroilerClassSchema } from './broilerclass.input';
import { PoultryFeedSchema } from './feed.input';

export const BroilerGroupSchema = object({
    meatChickenGrowers: BroilerClassSchema,
    meatChickenLayers: BroilerClassSchema,
    meatOther: BroilerClassSchema,
    feed: z.array(PoultryFeedSchema),
    customFeedPurchased: z
      .number()
      .min(0)
      .meta({ description: 'Custom feed purchased, in tonnes' }),
    customFeedEmissionIntensity: z.number().min(0).meta({
      description:
        'Emissions intensity of custom feed in GHG (kg CO2-e/kg input)',
    }),
  })
  .meta({ description: 'Poultry broiler group' });

export type BroilerGroup = z.infer<typeof BroilerGroupSchema>;
