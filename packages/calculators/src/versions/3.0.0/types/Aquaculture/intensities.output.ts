import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class AquacultureIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Total harvest weight in kg')
  @IsDefined()
  totalHarvestWeightKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Aquaculture emissions intensity excluding sequestration, in kg-CO2e/kg',
  )
  @IsDefined()
  aquacultureExcludingCarbonOffsets!: number;

  @IsNumber()
  @SchemaDescription(
    'Aquaculture emissions intensity including sequestration, in kg-CO2e/kg',
  )
  @IsDefined()
  aquacultureIncludingCarbonOffsets!: number;
}
