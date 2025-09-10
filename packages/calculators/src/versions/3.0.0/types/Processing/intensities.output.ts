import { IsDefined, IsEnum, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';
import { ProductUnit } from './product.input';

export class ProcessingIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Number of processed product units produced')
  @IsDefined()
  unitsProduced!: number;

  @IsEnum(ProductUnit)
  @SchemaDescription(
    'Unit type of the product being produced (used by "unitsProduced")',
  )
  @IsDefined()
  unitOfProduct!: ProductUnit;

  @IsNumber()
  @SchemaDescription(
    'Processing emissions intensity excluding carbon offsets, in kg-CO2e/number of units produced',
  )
  @IsDefined()
  processingExcludingCarbonOffsets!: number;

  @IsNumber()
  @SchemaDescription(
    'Processing emissions intensity including carbon offsets, in kg-CO2e/number of units produced',
  )
  @IsDefined()
  processingIncludingCarbonOffsets!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
