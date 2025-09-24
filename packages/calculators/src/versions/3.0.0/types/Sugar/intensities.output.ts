import { IsDefined, IsNumber } from 'class-validator';
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
