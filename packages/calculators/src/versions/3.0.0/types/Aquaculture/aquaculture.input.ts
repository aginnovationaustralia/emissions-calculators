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
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import 'reflect-metadata';
import { FluidWasteInput } from '../common/fluid-waste.input';
import { FreightInput } from '../common/freight.input';
import { SolidWasteInput } from '../common/solid-waste.input';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInput } from '../fuel.input';
import { RefrigerantInput } from '../refrigerant.input';
import {
  AquacultureProductionSystem,
  ElectricitySource,
  ElectricitySources,
  State,
  States,
} from '../types';
import { AquacultureBaitPurchase } from './baitpurchase.input';
import { AquacultureCustomBaitPurchase } from './custombaitpurchase.input';

@SchemaDescription('Input data required for a single aquaculture enterprise')
export class AquacultureEnterpriseInput {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsEnum(AquacultureProductionSystem)
  @SchemaDescription(DESCRIPTIONS.AQUACULTURE_PRODUCTION_SYSTEM)
  @IsDefined()
  productionSystem!: AquacultureProductionSystem;

  @IsNumber()
  @SchemaDescription('Total harvest in kg')
  @IsDefined()
  totalHarvestKg!: number;

  @TypeWithArraySchema(() => RefrigerantInput)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.REFRIGERANT)
  @IsDefined()
  refrigerants!: RefrigerantInput[];

  @TypeWithArraySchema(() => AquacultureBaitPurchase)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.AQUACULTURE_BAIT)
  @IsDefined()
  bait!: AquacultureBaitPurchase[];

  @TypeWithArraySchema(() => AquacultureCustomBaitPurchase)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.AQUACULTURE_CUSTOM_BAIT)
  @IsDefined()
  customBait!: AquacultureCustomBaitPurchase[];

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

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.CARBON_OFFSETS)
  carbonOffsets?: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
