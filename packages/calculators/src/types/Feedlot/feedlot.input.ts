import { ElectricitySources, FeedlotSystems, TruckTypes } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FertiliserSchema } from '../fertiliser.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { FeedlotGroupSchema } from './group.input';
import { FeedlotPurchasesSchema } from './purchases.input';
import { FeedlotSalesSchema } from './sales.input';

export const FeedlotCompleteSchema = singleEnterpriseInput('Feedlot', {
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
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  grainFeed: z.number().meta({ description: DESCRIPTIONS.GRAINFEED }),
  hayFeed: z.number().meta({ description: DESCRIPTIONS.HAYFEED }),
  cottonseedFeed: z.number().meta({ description: DESCRIPTIONS.COTTONSEEDFEED }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  distanceCattleTransported: z.number().meta({
    description: 'Distance cattle are transported to farm, in km (kilometres)',
  }),
  truckType: z
    .enum(TruckTypes)
    .meta({ description: 'Type of truck used for cattle transport' }),
  limestone: z.number().meta({ description: DESCRIPTIONS.LIMESTONE }),
  limestoneFraction: proportion(DESCRIPTIONS.LIMESTONEFRACTION),
});

export type FeedlotComplete = z.infer<typeof FeedlotCompleteSchema>;
