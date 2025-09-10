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
import { ElectricitySource, ElectricitySources, State, States } from '../types';
import { WildCatchFisheryBaitPurchase } from './baitpurchase.input';
import { WildCatchFisheryCustomBaitPurchase } from './custombaitpurchase.input';

export enum WildCatchFisheryProductionSystem {
  ABALONE = 'Abalone',
  CRAB_FISHING = 'Crab Fishing',
  DEMERSAL_TRAWL = 'Demersal Trawl',
  GILLNET = 'Gillnet',
  HANDLINE = 'Handline',
  LOBSTER_POT = 'Lobster Pot',
  LONGLINE = 'Longline',
  NORTHERN_FISH_TRAP = 'Northern Fish Trap',
  NORTHERN_PRAWN_TRAWL = 'Northern Prawn trawl',
  OTTER_BOARD_TRAWL = 'Otter Board Trawl',
  PRAWN_TRAWL_AUS_AVERAGE = 'Prawn trawl Australian average',
  PURSE_SEINE = 'Purse seine',
  SOUTHERN_OCEAN_LONGLINE = 'Southern Ocean Longline',
}

@SchemaDescription(
  'Input data required for a single wild catch fishery enterprise',
)
export class WildCatchFisheryEnterpriseInput {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsEnum(WildCatchFisheryProductionSystem)
  @SchemaDescription('Production system of the wild catch fishery enterprise')
  @IsDefined()
  productionSystem!: WildCatchFisheryProductionSystem;

  @IsNumber()
  @SchemaDescription('Total harvest in kg')
  @IsDefined()
  totalHarvestKg!: number;

  @TypeWithArraySchema(() => RefrigerantInput)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.REFRIGERANT)
  @IsDefined()
  refrigerants!: RefrigerantInput[];

  @TypeWithArraySchema(() => WildCatchFisheryBaitPurchase)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.AQUACULTURE_BAIT)
  @IsDefined()
  bait!: WildCatchFisheryBaitPurchase[];

  @TypeWithArraySchema(() => WildCatchFisheryCustomBaitPurchase)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.AQUACULTURE_CUSTOM_BAIT)
  @IsDefined()
  customBait!: WildCatchFisheryCustomBaitPurchase[];

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
