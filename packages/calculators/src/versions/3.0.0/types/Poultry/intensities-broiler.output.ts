import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class PoultryEmissionsIntensitiesBroiler {
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
  @SchemaDescription('Poultry meat produced in kg liveweight')
  @IsDefined()
  meatProducedKg!: number;
}
