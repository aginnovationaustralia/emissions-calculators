import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

export class GrainsIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Grain produced in tonnes')
  @IsDefined()
  grainProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Grains excluding sequestration, in t-CO2e/t grain')
  @IsDefined()
  grainsExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Grains including sequestration, in t-CO2e/t grain')
  @IsDefined()
  grainsIncludingSequestration!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
