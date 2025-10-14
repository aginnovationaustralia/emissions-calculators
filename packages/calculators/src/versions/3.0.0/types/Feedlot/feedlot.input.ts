import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { ElectricitySources, FeedlotSystems, TruckTypes } from '../types';
import { FeedlotGroupSchema } from './group.input';
import { FeedlotPurchasesSchema } from './purchases.input';
import { FeedlotSalesSchema } from './sales.input';

export const FeedlotCompleteSchema = z
  .object({
    id: z
      .string()
      .optional()
      .meta({ description: 'Unique identifier for the feedlot enterprise' }),
    system: z
      .enum(FeedlotSystems)
      .meta({ description: 'Type of feedlot/production system' }),
    groups: z.array(FeedlotGroupSchema),
    fertiliser: FertiliserSchema,
    purchases: FeedlotPurchasesSchema,
    sales: FeedlotSalesSchema,
    diesel: z.number().meta({ description: DESCRIPTIONS.DIESEL }),
    petrol: z.number().meta({ description: DESCRIPTIONS.PETROL }),
    lpg: z.number().meta({ description: DESCRIPTIONS.LPG }),
    electricitySource: z
      .enum(ElectricitySources)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
    electricityRenewable: z
      .number()
      .min(0)
      .max(1)
      .meta({ description: DESCRIPTIONS.ELECTRICITY_RENEWABLE }),
    electricityUse: z
      .number()
      .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
    grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
    hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
    cottonseedFeed: z
      .number()
      .meta({ description: DESCRIPTIONS.COTTONSEEDFEED }),
    herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
    herbicideOther: z
      .number()
      .meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
    distanceCattleTransported: z.number().meta({
      description:
        'Distance cattle are transported to farm, in km (kilometres)',
    }),
    truckType: z
      .enum(TruckTypes)
      .meta({ description: 'Type of truck used for cattle transport' }),
    limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
    limestoneFraction: z
      .number()
      .meta({ description: DESCRIPTIONS.LIMESTONEFRACTION }),
  })
  .meta({
    description:
      'All fields needed to describe the activity of a single feedlot enterprise',
  });

export type FeedlotComplete = z.infer<typeof FeedlotCompleteSchema>;
