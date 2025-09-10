import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

export class SugarIntensitiesOutput {
  @IsNumber()
  @SchemaDescription(
    'Sugar emissions intensity excluding sequestration, in kg-CO2e/kg sugar',
  )
  @IsDefined()
  sugarExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Sugar emissions intensity including sequestration, in kg-CO2e/kg sugar',
  )
  @IsDefined()
  sugarIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Sugar produced in kg')
  @IsDefined()
  sugarProducedKg!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
