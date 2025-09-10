import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class BuffaloEmissionsIntensities {
  @IsNumber()
  @SchemaDescription('Amount of buffalo meat produced in kg liveweight')
  @IsDefined()
  liveweightProducedKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Buffalo meat (breeding herd) excluding sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  buffaloMeatExcludingSequestration!: number;

  @IsNumber()
  @SchemaDescription(
    'Buffalo meat (breeding herd) including sequestration, in kg-CO2e/kg liveweight',
  )
  @IsDefined()
  buffaloMeatIncludingSequestration!: number;
}
