import { Type } from 'class-transformer';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { DESCRIPTIONS } from '../descriptions.schema';
import { State, States } from '../types';
import { ProductProcessingInput } from './processing.input';

@SchemaDescription('Input data required for the `processing` calculator')
export class ProcessingInput {
  @IsEnum(States)
  @SchemaDescription(DESCRIPTIONS.STATE)
  @IsDefined()
  state!: State;

  @ValidateNested({ always: true, each: true })
  @Type(() => ProductProcessingInput)
  @TypeWithArraySchema(() => ProductProcessingInput)
  @IsDefined()
  products!: ProductProcessingInput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
