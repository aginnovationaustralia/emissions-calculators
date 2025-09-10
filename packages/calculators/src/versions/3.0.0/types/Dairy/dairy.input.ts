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

import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { Fertiliser } from '../fertiliser.input';
import { TruckType, TruckTypes } from '../types';
import { AreaUsed } from './area.input';
import { DairyClasses } from './dairyclasses.input';
import { ManureManagement } from './manure.input';
import { SeasonalFertiliser } from './seasonalfertiliser.input';

export class DairyComplete {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @ValidateNested({ always: true })
  @Type(() => DairyClasses)
  @IsDefined()
  classes!: DairyClasses;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONE)
  @IsDefined()
  limestone!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONEFRACTION)
  @IsDefined()
  limestoneFraction!: number;

  @ValidateNested({ always: true })
  @Type(() => Fertiliser)
  @IsDefined()
  fertiliser!: Fertiliser;

  @ValidateNested({ always: true })
  @Type(() => SeasonalFertiliser)
  @IsDefined()
  seasonalFertiliser!: SeasonalFertiliser;

  @ValidateNested({ always: true })
  @Type(() => AreaUsed)
  @IsDefined()
  areas!: AreaUsed;

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

  @Type(() => ManureManagement)
  @ValidateNested({ always: true })
  @IsDefined()
  manureManagementMilkingCows!: ManureManagement;

  @Type(() => ManureManagement)
  @ValidateNested({ always: true })
  @IsDefined()
  manureManagementOtherDairyCows!: ManureManagement;

  @IsNumber()
  @SchemaDescription('Allocation as a fraction, from 0 to 1')
  @IsDefined()
  @Min(0)
  @Max(1)
  emissionsAllocationToRedMeatProduction!: number;

  @IsEnum(TruckTypes)
  @SchemaDescription('Type of truck used for cattle transport')
  @IsDefined()
  truckType!: TruckType;

  @IsNumber()
  @SchemaDescription(
    'Distance cattle are transported between farms, in km (kilometres)',
  )
  @IsDefined()
  distanceCattleTransported!: number;
}
