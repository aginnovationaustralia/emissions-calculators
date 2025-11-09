import { ElectricitySources } from '@/types/types';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { proportion } from '../schemas';
import { BroilerSaleSchema } from './broilersale.input';
import { BroilerGroupSchema } from './group.input';

export const BroilersCompleteSchema = z.object({
  id: z.string().optional().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
  groups: z.array(BroilerGroupSchema),
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
  hay: z.number().meta({ description: DESCRIPTIONS.HAY }),
  herbicide: z.number().meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z.number().meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  manureWasteAllocation: z.number().meta({
    description:
      'Fraction allocation of manure waste, from 0 to 1. Note: only for pasture range, paddock and free range systems',
  }),
  wasteHandledDrylotOrStorage: z.number().meta({
    description:
      'Fraction of waste handled through dryland and solid storage, from 0 to 1',
  }),
  litterRecycled: z
    .number()
    .meta({ description: 'Fraction of litter recycled, from 0 to 1' }),
  litterRecycleFrequency: z
    .number()
    .meta({ description: 'Number of litter cycles per year' }),
  purchasedFreeRange: z.number().meta({
    description:
      'Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is `1 - purchasedFreeRange`',
  }),
  meatChickenGrowersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of meat chicken growers',
  }),
  meatChickenLayersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of meat chicken layers',
  }),
  meatOtherPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of meat other',
  }),
  sales: z.array(BroilerSaleSchema).meta({ description: 'Broiler sales' }),
});

export type BroilersComplete = z.infer<typeof BroilersCompleteSchema>;
