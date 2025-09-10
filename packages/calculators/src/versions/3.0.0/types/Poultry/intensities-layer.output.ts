import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class PoultryEmissionsIntensitiesLayer {
  @IsNumber()
  @SchemaDescription(
    'Poultry eggs including carbon sequestration, in kg-CO2e/kg eggs',
  )
  @IsDefined()
  poultryEggsIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Poultry eggs excluding carbon sequestration, in kg-CO2e/kg eggs',
  )
  @IsDefined()
  poultryEggsExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Poultry eggs produced in kg')
  @IsDefined()
  eggsProducedKg!: number;
}
