import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

export class WildSeaFisheriesIntensitiesOutput {
  @IsNumber()
  @SchemaDescription(
    'Wild sea fisheries emissions intensity excluding carbon offsets, in kg-CO2e/kg',
  )
  @IsDefined()
  intensityExcludingCarbonOffset!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild sea fisheries emissions intensity including carbon offsets, in kg-CO2e/kg',
  )
  @IsDefined()
  intensityIncludingCarbonOffset!: number;

  @IsNumber()
  @SchemaDescription('Total harvest weight in tonnes')
  @IsDefined()
  totalHarvestWeightTonnes!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
