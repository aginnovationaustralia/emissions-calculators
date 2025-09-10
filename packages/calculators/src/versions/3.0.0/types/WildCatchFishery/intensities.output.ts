import { IsDefined, IsNumber } from 'class-validator';
import { SchemaDescription } from '../decorator.schema';

export class WildCatchFisheryIntensitiesOutput {
  @IsNumber()
  @SchemaDescription('Total harvest weight in kg')
  @IsDefined()
  totalHarvestWeightKg!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild catch fishery emissions intensity excluding sequestration, in kg-CO2e/kg harvest weight',
  )
  @IsDefined()
  wildCatchFisheryExcludingCarbonOffsets!: number;

  @IsNumber()
  @SchemaDescription(
    'Wild catch fishery emissions intensity including sequestration, in kg-CO2e/kg harvest weight',
  )
  @IsDefined()
  wildCatchFisheryIncludingCarbonOffsets!: number;
}


