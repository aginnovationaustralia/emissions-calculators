import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts/oas31';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { AquacultureEnterpriseInput } from './aquaculture.input';

@SchemaDescription('Input data required for the `aquaculture` calculator')
export class AquacultureInput {
  @ValidateNested({ always: true, each: true })
  @Type(() => AquacultureEnterpriseInput)
  @TypeWithArraySchema(() => AquacultureEnterpriseInput)
  @IsDefined()
  enterprises!: AquacultureEnterpriseInput[];
}

export const schemaAquacultureInput: SchemaObject =
  validationMetadatasToSchemas();
