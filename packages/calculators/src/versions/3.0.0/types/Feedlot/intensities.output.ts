import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class FeedlotEmissionIntensities {
  @IsNumber()
  @SchemaDescription('Amount of meat produced in kg liveweight')
  @IsDefined()
  liveweightProducedKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Beef including carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  beefIncludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Beef excluding carbon sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  beefExcludingSequestration!: number;
}
