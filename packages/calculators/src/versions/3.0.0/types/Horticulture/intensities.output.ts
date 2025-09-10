import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Horticulture intensities output')
export class HorticultureIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Horticultural crop produced in tonnes')
  @IsDefined()
  cropProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity excluding sequestration, in t-CO2e/t crop',
  )
  @IsDefined()
  tonnesCropExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity including sequestration, in t-CO2e/t crop',
  )
  @IsDefined()
  tonnesCropIncludingSequestration!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
