import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { LivestockPurchase } from '../livestockPurchase.input';
import { ElectricitySource, ElectricitySources } from '../types';
import { EggSale } from './eggsale.input';
import { PoultryFeed } from './feed.input';
import { LayerClass } from './layerclass.input';

export class LayersComplete {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @ValidateNested({ always: true })
  @Type(() => LayerClass)
  @SchemaDescription('Layers')
  @IsDefined()
  layers!: LayerClass;

  @ValidateNested({ always: true })
  @Type(() => LayerClass)
  @SchemaDescription('Meat chicken layers')
  @IsDefined()
  meatChickenLayers!: LayerClass;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PoultryFeed)
  @IsDefined()
  feed!: PoultryFeed[];

  @IsNumber()
  @SchemaDescription(
    'Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is `1 - purchasedFreeRange`',
  )
  @IsDefined()
  purchasedFreeRange!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.DIESEL)
  @IsDefined()
  diesel!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.PETROL)
  @IsDefined()
  petrol!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LPG)
  @IsDefined()
  lpg!: number;

  @IsEnum(ElectricitySources)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_SOURCE)
  @IsDefined()
  electricitySource!: ElectricitySource;

  @IsNumber()
  @Min(0)
  @Max(1)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_RENEWABLE)
  @IsDefined()
  electricityRenewable!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_USE)
  @IsDefined()
  electricityUse!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HAY)
  @IsDefined()
  hay!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HERBICIDE)
  @IsDefined()
  herbicide!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HERBICIDEOTHER)
  @IsDefined()
  herbicideOther!: number;

  @IsNumber()
  @SchemaDescription(
    'Fraction allocation of manure waste, from 0 to 1. Note: only for pasture range, paddock and free range systems',
  )
  @IsDefined()
  manureWasteAllocation!: number;

  @IsNumber()
  @IsDefined()
  @SchemaDescription(
    'Fraction of waste handled through dryland and solid storage, from 0 to 1',
  )
  wasteHandledDrylotOrStorage!: number;

  @IsNumber()
  @SchemaDescription('Fraction of litter recycled, from 0 to 1')
  @IsDefined()
  litterRecycled!: number;

  @IsNumber()
  @SchemaDescription('Number of litter cycles per year')
  @IsDefined()
  litterRecycleFrequency!: number;

  @ValidateNested({ always: true })
  @Type(() => LivestockPurchase)
  @SchemaDescription('Livestock purchases of meat chicken layers')
  @IsDefined()
  meatChickenLayersPurchases!: LivestockPurchase;

  @ValidateNested({ always: true })
  @Type(() => LivestockPurchase)
  @SchemaDescription('Livestock purchases of layers')
  @IsDefined()
  layersPurchases!: LivestockPurchase;

  @IsNumber()
  @SchemaDescription('Custom feed purchased, in tonnes')
  @IsDefined()
  customFeedPurchased!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of custom feed in GHG (kg CO2-e/kg input)',
  )
  @IsDefined()
  customFeedEmissionIntensity!: number;

  @ValidateNested({ always: true })
  @Type(() => EggSale)
  @SchemaDescription('Meat chicken layers egg sales')
  @IsDefined()
  meatChickenLayersEggSale!: EggSale;

  @ValidateNested({ always: true })
  @Type(() => EggSale)
  @SchemaDescription('Layers egg sales')
  @IsDefined()
  layersEggSale!: EggSale;
}
