import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import 'reflect-metadata';
import { SchemaDescription } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { ProductionSystem, ProductionSystems, State, States } from '../types';

export class SugarCrop {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsEnum(ProductionSystems)
  @SchemaDescription('Production system of this crop')
  @IsDefined()
  productionSystem!: ProductionSystem;

  @IsNumber()
  @SchemaDescription('Average cane/crop yield, in t/ha (tonnes per hectare)')
  @IsDefined()
  averageCaneYield!: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(
    'Percentage of cane yield that becomes milled sugar, from 0 to 1',
  )
  percentMilledCaneYield?: number;

  @IsNumber()
  @SchemaDescription('Area sown, in ha (hectares)')
  @IsDefined()
  areaSown!: number;

  // TODO!: group these fertilisers
  @IsNumber()
  @SchemaDescription(
    'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  )
  @IsDefined()
  nonUreaNitrogen!: number;

  @IsNumber()
  @SchemaDescription(
    'Urea nitrogen application, in kg Urea/ha (kilograms of urea per hectare)',
  )
  @IsDefined()
  ureaApplication!: number;

  @IsNumber()
  @SchemaDescription(
    'Urea-Ammonium nitrate application, in kg product/ha (kilograms of product per hectare)',
  )
  @IsDefined()
  ureaAmmoniumNitrate!: number;

  @IsNumber()
  @SchemaDescription(
    'Phosphorus application, in kg P/ha (kilograms of phosphorus per hectare)',
  )
  @IsDefined()
  phosphorusApplication!: number;

  @IsNumber()
  @SchemaDescription(
    'Potassium application, in kg K/ha (kilograms of potassium per hectare)',
  )
  @IsDefined()
  potassiumApplication!: number;

  @IsNumber()
  @SchemaDescription(
    'Sulfur application, in kg S/ha (kilograms of sulfur per hectare)',
  )
  @IsDefined()
  sulfurApplication!: number;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @IsNumber()
  @SchemaDescription(
    'Fraction of annual production of crop that is burnt, from 0 to 1',
  )
  @IsDefined()
  fractionOfAnnualCropBurnt!: number;

  @IsNumber()
  @SchemaDescription(
    'Total amount of active ingredients from general herbicide/pesticide use, in kg (kilogram)',
  )
  @IsDefined()
  herbicideUse!: number;

  @IsNumber()
  @SchemaDescription(
    'Total amount of active ingredients from other herbicide use (Paraquat, Diquat, Glyphosate), in kg (kilogram)',
  )
  @IsDefined()
  glyphosateOtherHerbicideUse!: number;

  @IsNumber()
  @SchemaDescription(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  )
  @IsDefined()
  electricityAllocation!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONE)
  @IsDefined()
  limestone!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONEFRACTION)
  @IsDefined()
  limestoneFraction!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.DIESEL)
  @IsDefined()
  dieselUse!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.PETROL)
  @IsDefined()
  petrolUse!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LPG)
  @IsDefined()
  lpg!: number;
}
