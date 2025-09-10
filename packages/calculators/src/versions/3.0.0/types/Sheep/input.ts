import { IsBoolean, IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { SheepComplete } from './sheep.input';
import { SheepVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `sheep` calculator')
export class SheepInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.NORTHOFTROPIC)
  @IsDefined()
  northOfTropicOfCapricorn!: boolean;

  @IsBoolean()
  @SchemaDescription(DESCRIPTIONS.RAINFALLABOVE600)
  @IsDefined()
  rainfallAbove600!: boolean;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepComplete)
  @TransformSingleOrArray(SheepComplete)
  @IsDefined()
  sheep!: SheepComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => SheepVegetation)
  @IsDefined()
  vegetation!: SheepVegetation[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
