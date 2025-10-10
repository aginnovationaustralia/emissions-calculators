import {
  IsDefined,
  IsEnum,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import { CropVegetation } from '../common/crop-vegetation.input';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { GrainsCrop } from './crop.input';

@SchemaDescription('Input data required for the `grains` calculator')
export class GrainsInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => GrainsCrop)
  @IsDefined()
  crops!: GrainsCrop[];

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
  @TypeWithArraySchema(() => CropVegetation)
  @IsDefined()
  vegetation!: CropVegetation[];
}
