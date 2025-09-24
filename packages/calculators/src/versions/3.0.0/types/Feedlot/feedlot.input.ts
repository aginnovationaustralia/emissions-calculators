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
import { Fertiliser } from '../fertiliser.input';
import {
  ElectricitySource,
  ElectricitySources,
  FeedlotSystem,
  FeedlotSystems,
  TruckType,
  TruckTypes,
} from '../types';
import { FeedlotGroup } from './group.input';
import { FeedlotPurchases } from './purchases.input';
import { FeedlotSales } from './sales.input';

@SchemaDescription(
  'All fields needed to describe the activity of a single feedlot enterprise',
)
export class FeedlotComplete {
  @IsString()
  @IsOptional()
  @SchemaDescription('Unique identifier for the feedlot enterprise')
  id?: string;

  @IsEnum(FeedlotSystems)
  @SchemaDescription('Type of feedlot/production system')
  @IsDefined()
  system!: FeedlotSystem;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => FeedlotGroup)
  @IsDefined()
  groups!: FeedlotGroup[];

  @ValidateNested({ always: true })
  @Type(() => Fertiliser)
  @IsDefined()
  fertiliser!: Fertiliser;

  @ValidateNested({ always: true })
  @Type(() => FeedlotPurchases)
  @IsDefined()
  purchases!: FeedlotPurchases;

  @ValidateNested({ always: true })
  @Type(() => FeedlotSales)
  @IsDefined()
  sales!: FeedlotSales;

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
  @SchemaDescription(DESCRIPTIONS.GRAINFEED)
  @IsDefined()
  grainFeed!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.HAYFEED)
  @IsDefined()
  hayFeed!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.COTTONSEEDFEED)
  @IsDefined()
  cottonseedFeed!: number;

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
    'Distance cattle are transported to farm, in km (kilometres)',
  )
  @IsDefined()
  distanceCattleTransported!: number;

  @IsEnum(TruckTypes)
  @SchemaDescription('Type of truck used for cattle transport')
  @IsDefined()
  truckType!: TruckType;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONE)
  @IsDefined()
  limestone!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONEFRACTION)
  @IsDefined()
  limestoneFraction!: number;
}
