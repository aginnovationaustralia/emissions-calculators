import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

export class WildCatchFisheryIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Total harvest weight in kg')
  @IsDefined()
  totalHarvestWeightKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild catch fishery emissions intensity excluding sequestration, in kg-CO2e/kg harvest weight',
  )
  @IsDefined()
  wildCatchFisheryExcludingCarbonOffsets!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild catch fishery emissions intensity including sequestration, in kg-CO2e/kg harvest weight',
  )
  @IsDefined()
  wildCatchFisheryIncludingCarbonOffsets!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
