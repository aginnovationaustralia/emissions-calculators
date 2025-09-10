import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { FeedlotComplete } from './feedlot.input';
import { FeedlotVegetation } from './vegetation.input';

@SchemaDescription('Input data required for the `feedlot` calculator')
export class FeedlotInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => FeedlotComplete)
  @IsDefined()
  feedlots!: FeedlotComplete[];

  @ValidateNested({ always: true, each: true })
  @TypeWithArraySchema(() => FeedlotVegetation)
  @IsDefined()
  vegetation!: FeedlotVegetation[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
