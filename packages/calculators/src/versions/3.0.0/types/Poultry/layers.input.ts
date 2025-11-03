import { z } from 'zod';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchaseSchema } from '../livestockPurchase.input';
import { proportion, singleEnterpriseInput } from '../schemas';
import { ElectricitySources } from '../types';
import { EggSaleSchema } from './eggsale.input';
import { PoultryFeedSchema } from './feed.input';
import { LayerClassSchema } from './layerclass.input';

export const LayersCompleteSchema = singleEnterpriseInput('Poultry (layers)', {
  layers: LayerClassSchema.meta({ description: 'Layers' }),
  meatChickenLayers: LayerClassSchema.meta({
    description: 'Meat chicken layers',
  }),
  feed: z.array(PoultryFeedSchema),
  purchasedFreeRange: z.number().meta({
    description:
      'Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is `1 - purchasedFreeRange`',
  }),
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
  meatChickenLayersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of meat chicken layers',
  }),
  layersPurchases: LivestockPurchaseSchema.meta({
    description: 'Livestock purchases of layers',
  }),
  customFeedPurchased: z
    .number()
    .meta({ description: 'Custom feed purchased, in tonnes' }),
  customFeedEmissionIntensity: z.number().meta({
    description:
      'Emissions intensity of custom feed in GHG (kg CO2-e/kg input)',
  }),
  meatChickenLayersEggSale: EggSaleSchema.meta({
    description: 'Meat chicken layers egg sales',
  }),
  layersEggSale: EggSaleSchema.meta({ description: 'Layers egg sales' }),
});

export type LayersComplete = z.infer<typeof LayersCompleteSchema>;
