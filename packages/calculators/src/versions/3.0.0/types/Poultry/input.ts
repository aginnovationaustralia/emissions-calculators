import { IsBoolean, IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import { TransformSingleOrArray } from '../../common/tools';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { BroilersComplete } from './broilers.input';
import { LayersComplete } from './layers.input';
import { PoultryVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `poultry` calculator')
export class PoultryInput {
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
  @TypeWithArraySchema(() => BroilersComplete)
  @TransformSingleOrArray(BroilersComplete)
  @IsDefined()
  broilers!: BroilersComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => LayersComplete)
  @TransformSingleOrArray(LayersComplete)
  @IsDefined()
  layers!: LayersComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => PoultryVegetation)
  @IsDefined()
  vegetation!: PoultryVegetation[];
}

export const schemaPoultryInput: SchemaObject = validationMetadatasToSchemas();
