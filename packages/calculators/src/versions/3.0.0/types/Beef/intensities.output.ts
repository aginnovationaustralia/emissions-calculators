import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class BeefEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Amount of beef produced in kg liveweight')
  @IsDefined()
  liveweightBeefProducedKg!: number;

  @IsNumber()
  @SchemaDescription('Beef excluding sequestration, in kg-CO2e/kg liveweight')
  @IsDefined()
  beefExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription('Beef including sequestration, in kg-CO2e/kg liveweight')
  @IsDefined()
  beefIncludingSequestration!: number;
}
