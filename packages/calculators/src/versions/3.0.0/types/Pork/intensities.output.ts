import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class PorkEmissionsIntensities {
  @IsNumber()
  @SchemaDescription(
    'Pork meat including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  porkMeatIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Pork meat excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  porkMeatExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Pork meat produced in kg liveweight')
  @IsDefined()
  liveweightProducedKg!: number;
}
