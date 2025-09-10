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
import { MineralSupplementation } from '../mineral.input';
import { ElectricitySource, ElectricitySources } from '../types';
import { BeefCalving } from './beefcalving.input';
import { BeefClasses } from './beefclasses.input';

export class BeefComplete {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @ValidateNested({ always: true })
  @Type(() => BeefClasses)
  @IsDefined()
  classes!: BeefClasses;

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

  @ValidateNested({ always: true })
  @Type(() => MineralSupplementation)
  @IsDefined()
  mineralSupplementation!: MineralSupplementation;

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

  @Type(() => BeefCalving)
  @ValidateNested({ always: true })
  @IsDefined()
  cowsCalving!: BeefCalving;
}
