import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class DeerEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Deer meat produced in kg liveweight')
  @IsDefined()
  liveweightProducedKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Deer meat (breeding herd) excluding sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  deerMeatExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Deer meat (breeding herd) including sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  deerMeatIncludingSequestration!: number;
}
