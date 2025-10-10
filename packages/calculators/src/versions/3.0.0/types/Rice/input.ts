import {
  IsDefined,
  IsEnum,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { RiceCrop } from './rice.input';
import { RiceVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `rice` calculator')
export class RiceInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => RiceCrop)
  @IsDefined()
  crops!: RiceCrop[];

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
  @TypeWithArraySchema(() => RiceVegetation)
  @IsDefined()
  vegetation!: RiceVegetation[];
}
export const schemaRiceInput: SchemaObject = validationMetadatasToSchemas();

