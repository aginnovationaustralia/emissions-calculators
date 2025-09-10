import {
  IsDefined,
  IsEnum,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { HorticultureCrop } from './horticulture.input';
import { HorticultureVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `horticulture` calculator')
export class HorticultureInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => HorticultureCrop)
  @IsDefined()
  crops!: HorticultureCrop[];

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

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => HorticultureVegetation)
  @IsDefined()
  vegetation!: HorticultureVegetation[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
