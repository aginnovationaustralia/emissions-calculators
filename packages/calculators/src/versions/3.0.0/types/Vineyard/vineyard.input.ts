import { Type } from 'class-transformer';
import {
  IsBoolean,
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
import { FluidWasteInput } from '../common/fluid-waste.input';
import { FreightInput } from '../common/freight.input';
import { SolidWasteInput } from '../common/solid-waste.input';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInput } from '../fuel.input';
import { ElectricitySource, ElectricitySources, State, States } from '../types';

export class VineyardCrop {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLIRRIGATIONABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.IRRIGATED)
  @IsDefined()
  irrigated!: boolean;

  @IsNumber()
  @SchemaDescription('Area planted, in ha (hectares)')
  @IsDefined()
  areaPlanted!: number;

  @IsNumber()
  @SchemaDescription('Average yield, in t/ha (tonnes per hectare)')
  @IsDefined()
  averageYield!: number;

  @IsNumber()
  @SchemaDescription(
    'Non-urea nitrogen application, in kg N/ha (kilograms of nitrogen per hectare)',
  )
  @IsDefined()
  nonUreaNitrogen!: number;

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
  @SchemaDescription(DESCRIPTIONS.LIMESTONE)
  @IsDefined()
  limestone!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.LIMESTONEFRACTION)
  @IsDefined()
  limestoneFraction!: number;

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
  @Min(0)
  @Max(1)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_RENEWABLE)
  @IsDefined()
  electricityRenewable!: number;

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_USE)
  @IsDefined()
  electricityUse!: number;

  @IsEnum(ElectricitySources)
  @SchemaDescription(DESCRIPTIONS.ELECTRICITY_SOURCE)
  @IsDefined()
  electricitySource!: ElectricitySource;

  @ValidateNested({ always: true })
  @Type(() => FuelInput)
  @SchemaDescription(DESCRIPTIONS.FUEL)
  @IsDefined()
  fuel!: FuelInput;

  @ValidateNested({ always: true, each: true })
  @Type(() => FluidWasteInput)
  @TypeWithArraySchema(() => FluidWasteInput)
  @SchemaDescription(DESCRIPTIONS.FLUID_WASTE)
  @IsDefined()
  fluidWaste!: FluidWasteInput[];

  @ValidateNested({ always: true })
  @Type(() => SolidWasteInput)
  @SchemaDescription(DESCRIPTIONS.SOLID_WASTE)
  @IsDefined()
  solidWaste!: SolidWasteInput;

  @TypeWithArraySchema(() => FreightInput)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.INBOUND_FREIGHT)
  @IsDefined()
  inboundFreight!: FreightInput[];

  @TypeWithArraySchema(() => FreightInput)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.OUTBOUND_FREIGHT)
  @IsDefined()
  outboundFreight!: FreightInput[];

  @IsNumber()
  @SchemaDescription(DESCRIPTIONS.TOTAL_COMMERCIAL_FLIGHTS_KM)
  @IsDefined()
  totalCommercialFlightsKm!: number;
}
