import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class PoultryEmissionsIntensities {
  @IsNumber()
  @SchemaDescription(
    'Poultry meat including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  poultryMeatIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Poultry meat excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  poultryMeatExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Poultry eggs including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  poultryEggsIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Poultry eggs excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  poultryEggsExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Poultry meat produced in kg')
  @IsDefined()
  meatProducedKg!: number;

  @IsNumber()
  @SchemaDescription('Amount of eggs produced, in kg')
  @IsDefined()
  eggsProducedKg!: number;
}
