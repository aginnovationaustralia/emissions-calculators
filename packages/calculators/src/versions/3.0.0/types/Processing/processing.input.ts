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
import { SolidWasteInput } from '../common/solid-waste.input';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { FuelInput } from '../fuel.input';
import { RefrigerantInput } from '../refrigerant.input';
import { ElectricitySource, ElectricitySources } from '../types';
import { ProcessingProduct } from './product.input';

@SchemaDescription('Input data required for processing a specific product')
export class ProductProcessingInput {
  @IsString()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.ACTIVITY_ID)
  id?: string;

  @ValidateNested({ always: true })
  @Type(() => ProcessingProduct)
  @SchemaDescription(DESCRIPTIONS.PROCESSING_PRODUCT)
  @IsDefined()
  product!: ProcessingProduct;

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

  @TypeWithArraySchema(() => RefrigerantInput)
  @ValidateNested({ always: true, each: true })
  @SchemaDescription(DESCRIPTIONS.REFRIGERANT)
  @IsDefined()
  refrigerants!: RefrigerantInput[];

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
  @SchemaDescription(DESCRIPTIONS.PURCHASED_CO2)
  @IsDefined()
  purchasedCO2!: number;

  @IsNumber()
  @IsOptional()
  @SchemaDescription(DESCRIPTIONS.CARBON_OFFSETS)
  carbonOffsets?: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
