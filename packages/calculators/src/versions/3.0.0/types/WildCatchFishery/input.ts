import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import 'reflect-metadata';
import { SchemaDescription, TypeWithArraySchema } from '../decorator.schema';
import { WildCatchFisheryEnterpriseInput } from './wildcatchfishery.input';

@SchemaDescription('Input data required for the `wildcatchfishery` calculator')
export class WildCatchFisheryInput {
  @ValidateNested({ always: true, each: true })
  @Type(() => WildCatchFisheryEnterpriseInput)
  @TypeWithArraySchema(() => WildCatchFisheryEnterpriseInput)
  @IsDefined()
  enterprises!: WildCatchFisheryEnterpriseInput[];
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
