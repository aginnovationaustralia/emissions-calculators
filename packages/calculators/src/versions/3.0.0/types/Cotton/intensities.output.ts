import { IsDefined, IsNumber } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { SchemaDescription } from '../decorator.schema';

@SchemaDescription('Cotton intensities output')
export class CottonIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Cotton yield produced in tonnes')
  @IsDefined()
  cottonYieldProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Number of bales produced')
  @IsDefined()
  balesProduced!: number;

  @IsNumber()
  @SchemaDescription('Cotton lint produced in tonnes')
  @IsDefined()
  lintProducedTonnes!: number;

  @IsNumber()
  @SchemaDescription('Cotton seed produced in tonnes')
  @IsDefined()
  seedProducedTonnes!: number;

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

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity excluding sequestration, in t-CO2e/bale',
  )
  @IsDefined()
  balesExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity including sequestration, in t-CO2e/bale',
  )
  @IsDefined()
  balesIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of lint including sequestration, in t-CO2e/kg',
  )
  @IsDefined()
  lintIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of lint excluding sequestration, in t-CO2e/kg',
  )
  @IsDefined()
  lintExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of seed including sequestration, in t-CO2e/kg',
  )
  @IsDefined()
  seedIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of seed excluding sequestration, in t-CO2e/kg',
  )
  @IsDefined()
  seedExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of lint using economic allocation, in t-CO2e/kg',
  )
  @IsDefined()
  lintEconomicAllocation!: number;

  @IsNumber()
  @SchemaDescription(
    'Emissions intensity of seed using economic allocation, in t-CO2e/kg',
  )
  @IsDefined()
  seedEconomicAllocation!: number;
}

const schema: Record<string, SchemaObject> = validationMetadatasToSchemas();

export { schema };
