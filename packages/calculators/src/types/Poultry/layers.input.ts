import { ElectricitySources } from '@/types/enums';
import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { EggSaleSchema } from './eggsale.input';
import { PoultryFeedSchema } from './feed.input';
import { LayerClassSchema } from './layerclass.input';

export const LayersCompleteSchema = singleEnterpriseInput('Poultry (layers)', {
  layers: LayerClassSchema.meta({ description: 'Layers' }),
  meatChickenLayers: LayerClassSchema.meta({
    description: 'Meat chicken layers',
  }),
  feed: z.array(PoultryFeedSchema),
  purchasedFreeRange: proportion(
    'Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is `1 - purchasedFreeRange`',
  ),
  diesel: z.number().min(0).meta({ description: DESCRIPTIONS.DIESEL }),
  petrol: z.number().min(0).meta({ description: DESCRIPTIONS.PETROL }),
  lpg: z.number().min(0).meta({ description: DESCRIPTIONS.LPG }),
  electricitySource: z
    .enum(ElectricitySources)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_SOURCE }),
  electricityRenewable: proportion(DESCRIPTIONS.ELECTRICITY_RENEWABLE),
  electricityUse: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.ELECTRICITY_USE }),
  hay: z.number().min(0).meta({ description: DESCRIPTIONS.HAY }),
  herbicide: z.number().min(0).meta({ description: DESCRIPTIONS.HERBICIDE }),
  herbicideOther: z
    .number()
    .min(0)
    .meta({ description: DESCRIPTIONS.HERBICIDEOTHER }),
  manureWasteAllocation: proportion(
    'Fraction allocation of manure waste, from 0 to 1. Note: only for pasture range, paddock and free range systems',
  ),
  wasteHandledDrylotOrStorage: proportion(
    'Fraction of waste handled through dryland and solid storage, from 0 to 1',
  ),
  litterRecycled: proportion('Fraction of litter recycled, from 0 to 1'),
  litterRecycleFrequency: z
    .number()
    .min(0)
    .meta({ description: 'Number of litter cycles per year' }),
  meatChickenLayersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of meat chicken layers',
  }),
  layersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of layers',
  }),
  customFeedPurchased: z
    .number()
    .min(0)
    .meta({ description: 'Custom feed purchased, in tonnes' }),
  customFeedEmissionIntensity: z.number().min(0).meta({
    description:
      'Emissions intensity of custom feed in GHG (kg CO2-e/kg input)',
  }),
  meatChickenLayersEggSale: EggSaleSchema.meta({
    description: 'Meat chicken layers egg sales',
  }),
  layersEggSale: EggSaleSchema.meta({ description: 'Layers egg sales' }),
});

export type LayersComplete = z.infer<typeof LayersCompleteSchema>;
