import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

export class AquacultureIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Total harvest weight in kg')
  @IsDefined()
  totalHarvestWeightKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Aquaculture emissions intensity excluding sequestration, in kg-CO2e/kg',
  )
  @IsDefined()
  aquacultureExcludingCarbonOffsets!: number;

  @IsNumber()
  @SchemaDescription(
    'Aquaculture emissions intensity including sequestration, in kg-CO2e/kg',
  )
  @IsDefined()
  aquacultureIncludingCarbonOffsets!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
