import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class VineyardIntensitiesOutput {
  @IsNumber()
  @SchemaDescription(
    'Vineyard emissions intensity excluding sequestration, in kg-CO2e/kg crop',
  )
  @IsDefined()
  vineyardsExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Vineyard emissions intensity including sequestration, in kg-CO2e/kg crop',
  )
  @IsDefined()
  vineyardsIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Vineyard crop produced in kg')
  @IsDefined()
  cropProducedKg!: number;
}


