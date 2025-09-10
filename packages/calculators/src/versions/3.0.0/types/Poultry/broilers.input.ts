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
import { BroilerSale } from './broilersale.input';
import { BroilerGroup } from './group.input';

export class BroilersComplete {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BroilerGroup)
  @IsDefined()
  groups!: BroilerGroup[];

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
  @SchemaDescription(
    'Fraction of waste handled through dryland and solid storage, from 0 to 1',
  )
  @IsDefined()
  wasteHandledDrylotOrStorage!: number;

  @IsNumber()
  @SchemaDescription('Fraction of litter recycled, from 0 to 1')
  @IsDefined()
  litterRecycled!: number;

  @IsNumber()
  @SchemaDescription('Number of litter cycles per year')
  @IsDefined()
  litterRecycleFrequency!: number;

  @IsNumber()
  @SchemaDescription(
    'Fraction of chickens purchased that are free range. Note: fraction of chickens purchased that are conventional is `1 - purchasedFreeRange`',
  )
  @IsDefined()
  purchasedFreeRange!: number;

  @ValidateNested({ always: true })
  @Type(() => LivestockPurchase)
  @SchemaDescription('Livestock purchases of meat chicken growers')
  @IsDefined()
  meatChickenGrowersPurchases!: LivestockPurchase;

  @ValidateNested({ always: true })
  @Type(() => LivestockPurchase)
  @SchemaDescription('Livestock purchases of meat chicken layers')
  @IsDefined()
  meatChickenLayersPurchases!: LivestockPurchase;

  @ValidateNested({ always: true })
  @Type(() => LivestockPurchase)
  @SchemaDescription('Livestock purchases of meat other')
  @IsDefined()
  meatOtherPurchases!: LivestockPurchase;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => BroilerSale, 'Broiler sales')
  @IsDefined()
  sales!: BroilerSale[];
}
